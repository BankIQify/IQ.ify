
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-key',
};

// Handle the webhook request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`Received ${req.method} request to process-ai-webhook`);
  
  try {
    // Get webhook key for authentication
    const webhookKey = req.headers.get('x-webhook-key');
    
    if (!webhookKey) {
      console.error('Missing webhook key');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing webhook key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify the webhook key
    const { data: keyCheck, error: keyCheckError } = await supabaseAdmin
      .from('webhook_keys')
      .select('id')
      .eq('api_key', webhookKey)
      .maybeSingle();

    if (keyCheckError || !keyCheck) {
      console.error('Invalid webhook key or error checking key', keyCheckError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid webhook key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the webhook payload
    const payload = await req.json();
    console.log('Received webhook payload:', JSON.stringify(payload));

    // Check if this is a raw text submission
    if (payload.raw_text && payload.sub_topic_id) {
      console.log('Received raw text submission');
      // Store the event but don't process it automatically - let the user edit it in the UI
      const { data: eventData, error: eventError } = await supabaseAdmin
        .from('webhook_events')
        .insert({
          source: payload.source || 'external_ai',
          event_type: 'question_generated',
          payload: {
            sub_topic_id: payload.sub_topic_id,
            sub_topic_name: payload.sub_topic_name || null,
            prompt: payload.prompt || null,
            raw_text: payload.raw_text,
            questions: [] // Empty array to be filled after editing
          },
          processed: false
        })
        .select('id')
        .single();

      if (eventError) {
        console.error('Error recording webhook event with raw text:', eventError);
        return new Response(
          JSON.stringify({ error: 'Failed to record webhook event with raw text' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Raw text questions received and stored for editing', 
          event_id: eventData.id
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Record the webhook event
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        source: payload.source || 'external_ai',
        event_type: payload.event_type || 'question_generated',
        payload: payload,
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('Error recording webhook event:', eventError);
      return new Response(
        JSON.stringify({ error: 'Failed to record webhook event' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process different types of events
    let result;
    switch (payload.event_type) {
      case 'question_generated':
        // Only process immediately if we have structured questions
        if (payload.questions && Array.isArray(payload.questions) && payload.questions.length > 0) {
          result = await handleQuestionGenerated(supabaseAdmin, payload);
          
          // Mark the event as processed if successful
          if (result.success) {
            await supabaseAdmin
              .from('webhook_events')
              .update({ 
                processed: true,
                processed_at: new Date().toISOString()
              })
              .eq('id', eventData.id);
          }
        } else {
          // No structured questions, leave unprocessed for manual review
          result = { 
            success: true, 
            message: 'Event stored for manual review'
          };
        }
        break;
      default:
        result = { 
          success: false, 
          message: 'Unsupported event type' 
        };
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to handle question generation events
async function handleQuestionGenerated(supabase, payload) {
  const { questions, sub_topic_id, prompt } = payload;
  
  if (!sub_topic_id) {
    return { success: false, error: 'Missing sub_topic_id in payload' };
  }
  
  if (!questions || !Array.isArray(questions)) {
    return { success: false, error: 'Missing or invalid questions array in payload' };
  }
  
  try {
    // Insert all questions in parallel
    const insertPromises = questions.map(question => 
      supabase
        .from('questions')
        .insert({
          content: question,
          sub_topic_id: sub_topic_id,
          generation_prompt: prompt || null,
          ai_generated: true,
          question_type: determineQuestionType(question),
          difficulty: question.difficulty || 'medium', // Set difficulty or default to medium
        })
    );

    const results = await Promise.all(insertPromises);
    
    // Check for any insert errors
    const insertErrors = results
      .map(result => result.error)
      .filter(error => error !== null);

    if (insertErrors.length > 0) {
      console.error('Database insert errors:', insertErrors);
      return { success: false, error: 'Failed to save some generated questions', details: insertErrors };
    }
    
    return { 
      success: true, 
      message: `${questions.length} questions saved successfully`, 
      question_count: questions.length 
    };
  } catch (error) {
    console.error('Error processing questions:', error);
    return { success: false, error: `Failed to process questions: ${error.message}` };
  }
}

// Helper function to determine question type based on content
function determineQuestionType(questionContent) {
  if (questionContent.primaryOptions && questionContent.secondaryOptions) {
    return 'multiple_choice';
  } else if (questionContent.options && Array.isArray(questionContent.options)) {
    return 'multiple_choice';
  } else if (questionContent.imageUrl) {
    return 'image';
  } else {
    return 'text';
  }
}
