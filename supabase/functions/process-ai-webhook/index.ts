
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "../_shared/webhook-utils.ts";
import { verifyWebhookKey } from "./auth.ts";
import { handleRawTextSubmission, handleQuestionGenerated } from "./handlers.ts";
import { parseWebhookRequest, validatePayload } from "./requestParser.ts";
import { recordWebhookEvent, markEventAsProcessed } from "./eventRecorder.ts";

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
  console.log(`Origin: ${req.headers.get('origin') || 'Not specified'}`);
  console.log(`User-Agent: ${req.headers.get('user-agent') || 'Not specified'}`);
  console.log(`Content-Type: ${req.headers.get('content-type') || 'Not specified'}`);
  
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
    const { payload, error: parseError } = await parseWebhookRequest(req);
    if (parseError) return parseError;
    
    // Validate the payload
    const { valid, error: validateError } = validatePayload(payload!);
    if (!valid) return validateError!;

    // Record the webhook event
    const eventData = await recordWebhookEvent(
      supabaseAdmin, 
      payload, 
      payload!.source, 
      payload!.event_type
    );

    if (!eventData) {
      return createErrorResponse('Failed to record webhook event', 500);
    }

    // Check if this is a raw text submission
    if (payload!.raw_text && payload!.sub_topic_id) {
      console.log('Processing raw text submission');
      return await handleRawTextSubmission(supabaseAdmin, payload!);
    }

    // Process different types of events
    let result;
    switch (payload!.event_type) {
      case 'question_generated':
        // Only process immediately if we have structured questions
        if (payload!.questions && Array.isArray(payload!.questions) && payload!.questions.length > 0) {
          console.log('Processing question_generated event with structured data');
          result = await handleQuestionGenerated(supabaseAdmin, payload!);
          
          // Mark the event as processed if successful
          if (result.success) {
            await markEventAsProcessed(supabaseAdmin, eventData.id);
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
        console.log(`Unsupported event type: ${payload!.event_type}`);
        result = { 
          success: false, 
          message: `Unsupported event type: ${payload!.event_type}` 
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
