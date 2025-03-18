
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/webhook-utils.ts";
import { verifyWebhookKey } from "./auth.ts";
import { handleRawTextSubmission, handleQuestionGenerated } from "./handlers.ts";

// Handle the webhook request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`Received ${req.method} request to process-ai-webhook`);
  console.log(`URL: ${req.url}`);
  
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return createErrorResponse('Server configuration error: Missing environment variables', 500);
    }
    
    // Verify the webhook key
    const authResult = await verifyWebhookKey(req, supabaseUrl, supabaseServiceKey);
    if (!authResult.valid) {
      return authResult.response;
    }
    
    const supabaseAdmin = authResult.supabaseAdmin;

    // Parse the webhook payload
    let payload;
    try {
      payload = await req.json();
      console.log('Received webhook payload:', JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to parse JSON payload:', error);
      return createErrorResponse('Invalid JSON payload', 400);
    }

    if (!payload) {
      return createErrorResponse('Empty payload received', 400);
    }

    // Check if this is a raw text submission
    if (payload.raw_text && payload.sub_topic_id) {
      return await handleRawTextSubmission(supabaseAdmin, payload);
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
      return createErrorResponse('Failed to record webhook event', 500);
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
          message: `Unsupported event type: ${payload.event_type}` 
        };
    }

    return createSuccessResponse(result, result.success ? 200 : 400);
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return createErrorResponse(`Internal server error: ${error.message}`, 500);
  }
});
