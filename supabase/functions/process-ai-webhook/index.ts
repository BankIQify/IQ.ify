
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/webhook-utils.ts";
import { verifyWebhookKey } from "./auth.ts";
import { handleRawTextSubmission, handleQuestionGenerated } from "./handlers.ts";

// Handle the webhook request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Received OPTIONS request, returning CORS headers');
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`============= START WEBHOOK REQUEST =============`);
  console.log(`Received ${req.method} request to process-ai-webhook`);
  console.log(`URL: ${req.url}`);
  
  // Log all request headers for debugging
  console.log('Request headers:');
  req.headers.forEach((value, key) => {
    // Don't log actual authorization values for security
    if (key.toLowerCase() === 'authorization' || key.toLowerCase() === 'x-webhook-key') {
      console.log(`${key}: [REDACTED]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  
  try {
    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      console.error('SUPABASE_URL present:', !!supabaseUrl);
      console.error('SUPABASE_SERVICE_ROLE_KEY present:', !!supabaseServiceKey);
      return createErrorResponse('Server configuration error: Missing environment variables', 500);
    }
    
    // Verify the webhook key
    const authResult = await verifyWebhookKey(req, supabaseUrl, supabaseServiceKey);
    if (!authResult.valid) {
      console.error('Authentication failed');
      return authResult.response;
    }
    
    const supabaseAdmin = authResult.supabaseAdmin;
    console.log('Authentication successful, processing payload');

    // Parse the webhook payload
    let payload;
    let rawBody;
    try {
      // First, get the raw body for logging in case of parse error
      rawBody = await req.text();
      console.log('Raw payload received:', rawBody);
      
      // Try to parse as JSON
      try {
        payload = JSON.parse(rawBody);
        console.log('Parsed JSON payload:', JSON.stringify(payload, null, 2));
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        return createErrorResponse(`Invalid JSON payload: ${parseError.message}. Please ensure you're sending valid JSON.`, 400);
      }
    } catch (error) {
      console.error('Failed to read request body:', error);
      return createErrorResponse('Failed to read request body', 400);
    }

    if (!payload) {
      console.error('Empty payload received');
      return createErrorResponse('Empty payload received', 400);
    }

    // Validate the required fields based on the payload type
    if (payload.raw_text && payload.sub_topic_id) {
      // For raw text submissions, these fields are sufficient
      console.log('Processing raw text submission');
    } else if (payload.event_type === 'question_generated') {
      // For question_generated events, validate required fields
      if (!payload.sub_topic_id) {
        console.error('Missing required field: sub_topic_id');
        return createErrorResponse('Missing required field: sub_topic_id', 400);
      }
      
      // Questions array is optional for raw storage, but should be validated if present
      if (payload.questions && (!Array.isArray(payload.questions) || payload.questions.length === 0)) {
        console.error('Invalid questions array: must be a non-empty array');
        return createErrorResponse('Invalid questions array: must be a non-empty array', 400);
      }
    } else {
      console.error('Unrecognized payload structure. Expected either raw_text+sub_topic_id or event_type+sub_topic_id+questions');
      return createErrorResponse('Unrecognized payload structure. Please check the documentation for valid formats.', 400);
    }

    // Check if this is a raw text submission
    if (payload.raw_text && payload.sub_topic_id) {
      console.log('Processing raw text submission');
      return await handleRawTextSubmission(supabaseAdmin, payload);
    }

    // Record the webhook event
    console.log('Recording webhook event in database');
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
    
    console.log('Event recorded with ID:', eventData.id);

    // Process different types of events
    let result;
    switch (payload.event_type) {
      case 'question_generated':
        // Only process immediately if we have structured questions
        if (payload.questions && Array.isArray(payload.questions) && payload.questions.length > 0) {
          console.log('Processing question_generated event with structured data');
          result = await handleQuestionGenerated(supabaseAdmin, payload);
          
          // Mark the event as processed if successful
          if (result.success) {
            console.log('Questions processed successfully, marking event as processed');
            await supabaseAdmin
              .from('webhook_events')
              .update({ 
                processed: true,
                processed_at: new Date().toISOString()
              })
              .eq('id', eventData.id);
          } else {
            console.error('Question processing failed:', result);
          }
        } else {
          // No structured questions, leave unprocessed for manual review
          console.log('No structured questions found, storing for manual review');
          result = { 
            success: true, 
            message: 'Event stored for manual review'
          };
        }
        break;
      default:
        console.log(`Unsupported event type: ${payload.event_type}`);
        result = { 
          success: false, 
          message: `Unsupported event type: ${payload.event_type}` 
        };
    }

    console.log(`============= END WEBHOOK REQUEST =============`);
    return createSuccessResponse(result, result.success ? 200 : 400);
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error(`============= END WEBHOOK REQUEST WITH ERROR =============`);
    return createErrorResponse(`Internal server error: ${error.message}`, 500);
  }
});
