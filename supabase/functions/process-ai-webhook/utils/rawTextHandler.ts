
import { createSuccessResponse } from "../../_shared/webhook-utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Handles raw text submissions from AI services
 * Stores the raw text as a webhook event for later editing
 */
export async function handleRawTextSubmission(
  supabaseAdmin: ReturnType<typeof createClient>, 
  payload: any
) {
  console.log('Received raw text submission');
  console.log('Raw text length:', payload.raw_text?.length || 0);
  console.log('Raw text excerpt:', payload.raw_text?.substring(0, 100) + '...');
  
  try {
    // Make sure we have the required fields
    if (!payload.sub_topic_id) {
      console.error('Missing sub_topic_id in raw text payload');
      throw new Error('Missing sub_topic_id in raw text payload');
    }
    
    if (!payload.raw_text || typeof payload.raw_text !== 'string') {
      console.error('Missing or invalid raw_text in payload');
      throw new Error('Missing or invalid raw_text in payload');
    }
    
    // Clean the text by removing problematic characters that might interfere with parsing
    const cleanedText = payload.raw_text
      .replace(/###\s*[^#\n]+/g, '\n') // Replace headings with newlines
      .replace(/#/g, '') // Remove any remaining # characters
      .trim();
    
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
          raw_text: cleanedText, // Use the cleaned text
          questions: [] // Empty array to be filled after editing
        },
        processed: false
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('Error recording webhook event with raw text:', eventError);
      throw new Error(`Failed to record webhook event with raw text: ${eventError.message}`);
    }

    return createSuccessResponse({
      success: true,
      message: 'Raw text questions received and stored for editing', 
      event_id: eventData.id
    });
  } catch (error) {
    console.error('Error in handleRawTextSubmission:', error);
    throw error; // Let the main handler catch and format the error response
  }
}
