
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function recordWebhookEvent(
  supabaseAdmin: ReturnType<typeof createClient>,
  payload: any,
  source: string = 'external_ai',
  eventType: string = 'question_generated'
): Promise<{ id: string } | null> {
  try {
    console.log('Recording webhook event in database');
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        source: source || 'external_ai',
        event_type: eventType || 'question_generated',
        payload: payload,
      })
      .select('id')
      .single();

    if (eventError) {
      console.error('Error recording webhook event:', eventError);
      return null;
    }
    
    console.log('Event recorded with ID:', eventData.id);
    return eventData;
  } catch (error) {
    console.error('Error in recordWebhookEvent:', error);
    return null;
  }
}

export async function markEventAsProcessed(
  supabaseAdmin: ReturnType<typeof createClient>,
  eventId: string
): Promise<boolean> {
  try {
    console.log('Marking event as processed:', eventId);
    const { error } = await supabaseAdmin
      .from('webhook_events')
      .update({ 
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', eventId);
      
    if (error) {
      console.error('Error marking event as processed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markEventAsProcessed:', error);
    return false;
  }
}
