
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-key',
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.');
}

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
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Verify the webhook key
    const { data: isValid, error: keyCheckError } = await supabaseAdmin.rpc(
      'is_valid_webhook_key',
      { key_to_check: webhookKey }
    );

    if (keyCheckError || !isValid) {
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

    // Record the webhook event
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('webhook_events')
      .insert({
        source: 'make_openai_integration',
        event_type: payload.event_type || 'unknown',
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
      case 'conversation_created':
        result = await handleConversationCreated(supabaseAdmin, payload);
        break;
      case 'message_created':
        result = await handleMessageCreated(supabaseAdmin, payload);
        break;
      default:
        result = { 
          success: true, 
          message: 'Webhook received, but no specific handler for this event type' 
        };
    }

    // Mark the event as processed
    await supabaseAdmin
      .from('webhook_events')
      .update({ 
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', eventData.id);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
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

// Helper function to handle conversation creation events
async function handleConversationCreated(supabase, payload) {
  const { user_id, title } = payload;
  
  if (!user_id) {
    return { success: false, error: 'Missing user_id in payload' };
  }
  
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({
      user_id,
      title: title || 'New Conversation',
    })
    .select('id')
    .single();
    
  if (error) {
    console.error('Error creating conversation:', error);
    return { success: false, error: 'Failed to create conversation' };
  }
  
  return { 
    success: true, 
    message: 'Conversation created successfully', 
    conversation_id: data.id 
  };
}

// Helper function to handle message creation events
async function handleMessageCreated(supabase, payload) {
  const { conversation_id, role, content, tokens_used } = payload;
  
  if (!conversation_id || !role || !content) {
    return { 
      success: false, 
      error: 'Missing required fields (conversation_id, role, or content) in payload' 
    };
  }
  
  const { data, error } = await supabase
    .from('ai_messages')
    .insert({
      conversation_id,
      role,
      content,
      tokens_used: tokens_used || null,
    })
    .select('id')
    .single();
    
  if (error) {
    console.error('Error creating message:', error);
    return { success: false, error: 'Failed to create message' };
  }
  
  return { 
    success: true, 
    message: 'Message created successfully', 
    message_id: data.id 
  };
}

// Helper function to create Supabase client with admin privileges
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      insert: (data) => ({
        select: (columns) => ({
          single: () => performRequest('POST', `${supabaseUrl}/rest/v1/${table}`, data, supabaseKey, { columns, single: true })
        })
      }),
      update: (data) => ({
        eq: (column, value) => performRequest('PATCH', `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, data, supabaseKey)
      }),
      select: (columns) => ({
        eq: (column, value) => ({
          single: () => performRequest('GET', `${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`, null, supabaseKey, { single: true })
        })
      })
    }),
    rpc: (functionName, params) => performRequest('POST', `${supabaseUrl}/rest/v1/rpc/${functionName}`, params, supabaseKey)
  };
}

async function performRequest(method, url, body, apiKey, options = {}) {
  const headers = {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Prefer': options.single ? 'return=representation,count=exact' : 'return=representation'
  };

  if (options.columns) {
    url = `${url}?select=${options.columns}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { data: null, error: { message: data.message || 'An error occurred', status: response.status } };
    }
    
    return { data: options.single ? data[0] : data, error: null };
  } catch (error) {
    return { data: null, error: { message: error.message, original: error } };
  }
}
