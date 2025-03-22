
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
    let payload;
    let rawBody;
    try {
      // First, get the raw body text
      rawBody = await req.text();
      console.log('Raw payload received:', rawBody);
      
      // Check content type to determine how to process the payload
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        // Try to parse as JSON if content-type indicates JSON
        try {
          // Try to clean up the JSON by removing problematic characters that might be present
          const cleanedJson = rawBody
            .replace(/###\s*[^#\n]+/g, '') // Remove "### Something" headings
            .replace(/#/g, '') // Remove any remaining # characters
            .trim();
            
          console.log('Cleaned JSON for parsing:', cleanedJson);
          
          try {
            payload = JSON.parse(cleanedJson);
            console.log('Parsed JSON payload:', JSON.stringify(payload, null, 2));
          } catch (innerParseError) {
            console.error('Clean JSON parse also failed:', innerParseError.message);
            throw innerParseError;
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError.message);
          console.log('Treating payload as raw text due to JSON parse error');
          
          // If JSON parsing fails but we have text, treat it as raw text submission
          if (rawBody.trim()) {
            // Extract sub_topic_id if present in the text using various possible formats
            // Look for: sub_topic_id, subtopicUUID, subtopicId, subtopic_id, etc.
            const subTopicIdRegexes = [
              /sub[_-]?topic[_-]?id:?\s*["']?([a-f0-9-]{36})["']?/i,
              /subtopic[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
              /subject[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i, // Sometimes mistakenly used
              /"subtopic(?:UUID|Id|_id)"\s*:\s*"([a-f0-9-]{36})"/i,
              /"sub_topic_id"\s*:\s*"([a-f0-9-]{36})"/i
            ];
            
            let subTopicId = null;
            for (const regex of subTopicIdRegexes) {
              const match = rawBody.match(regex);
              if (match && match[1]) {
                subTopicId = match[1];
                console.log(`Extracted sub_topic_id using pattern ${regex}: ${subTopicId}`);
                break;
              }
            }
            
            if (subTopicId) {
              console.log('Extracted sub_topic_id from text:', subTopicId);
              payload = {
                raw_text: rawBody,
                sub_topic_id: subTopicId
              };
            } else {
              console.error('Could not extract sub_topic_id from the text payload');
              return createErrorResponse('Could not parse as JSON and no sub_topic_id was found in the text. Please include sub_topic_id: UUID in the text.', 400);
            }
          } else {
            return createErrorResponse(`Invalid JSON payload: ${parseError.message}. Please ensure you're sending valid JSON.`, 400);
          }
        }
      } else if (contentType.includes('text/plain') || contentType.includes('text')) {
        // Handle plain text content - try to extract sub_topic_id
        console.log('Processing as plain text content');
        
        // Look for various forms of sub_topic_id
        const subTopicIdRegexes = [
          /sub[_-]?topic[_-]?id:?\s*["']?([a-f0-9-]{36})["']?/i,
          /subtopic[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
          /subject[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
          /"subtopic(?:UUID|Id|_id)"\s*:\s*"([a-f0-9-]{36})"/i,
          /"sub_topic_id"\s*:\s*"([a-f0-9-]{36})"/i
        ];
        
        let subTopicId = null;
        for (const regex of subTopicIdRegexes) {
          const match = rawBody.match(regex);
          if (match && match[1]) {
            subTopicId = match[1];
            console.log(`Extracted sub_topic_id using pattern ${regex}: ${subTopicId}`);
            break;
          }
        }
        
        if (subTopicId) {
          console.log('Extracted sub_topic_id from text:', subTopicId);
          payload = {
            raw_text: rawBody,
            sub_topic_id: subTopicId
          };
        } else {
          console.error('Could not extract sub_topic_id from the text payload');
          return createErrorResponse('Missing sub_topic_id in text payload. Please include sub_topic_id: UUID in the text.', 400);
        }
      } else {
        // For other content types, attempt JSON parse first
        try {
          // Try to clean up the text by removing problematic characters
          const cleanedText = rawBody
            .replace(/###\s*[^#\n]+/g, '') // Remove "### Something" headings
            .replace(/#/g, '') // Remove any remaining # characters
            .trim();
          
          payload = JSON.parse(cleanedText);
        } catch (parseError) {
          // If that fails, check if it might be text with a sub_topic_id
          const subTopicIdRegexes = [
            /sub[_-]?topic[_-]?id:?\s*["']?([a-f0-9-]{36})["']?/i,
            /subtopic[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
            /subject[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
            /"subtopic(?:UUID|Id|_id)"\s*:\s*"([a-f0-9-]{36})"/i,
            /"sub_topic_id"\s*:\s*"([a-f0-9-]{36})"/i
          ];
          
          let subTopicId = null;
          for (const regex of subTopicIdRegexes) {
            const match = rawBody.match(regex);
            if (match && match[1]) {
              subTopicId = match[1];
              console.log(`Extracted sub_topic_id using pattern ${regex}: ${subTopicId}`);
              break;
            }
          }
          
          if (subTopicId) {
            payload = {
              raw_text: rawBody,
              sub_topic_id: subTopicId
            };
          } else {
            console.error('Could not parse payload and no sub_topic_id found');
            return createErrorResponse('Unsupported content type and payload could not be parsed', 400);
          }
        }
      }
    } catch (error) {
      console.error('Failed to read or process request body:', error);
      return createErrorResponse('Failed to read or process request body', 400);
    }

    if (!payload) {
      console.error('Empty payload received');
      return createErrorResponse('Empty payload received', 400);
    }

    console.log('Final processed payload:', JSON.stringify(payload, null, 2));

    // Check if this is a raw text submission
    if (payload.raw_text && payload.sub_topic_id) {
      console.log('Processing raw text submission');
      return await handleRawTextSubmission(supabaseAdmin, payload);
    }

    // Validate the required fields based on the payload type
    if (payload.event_type === 'question_generated') {
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
    } else if (!payload.raw_text || !payload.sub_topic_id) {
      console.error('Unrecognized payload structure without raw_text and sub_topic_id');
      return createErrorResponse('Unrecognized payload structure. Please check the documentation for valid formats.', 400);
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
