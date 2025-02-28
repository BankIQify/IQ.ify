
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.');
}

// Helper function to create Supabase client
function createClient(supabaseUrl, supabaseKey) {
  return {
    from: (table) => ({
      insert: (data) => ({
        select: (columns) => ({
          single: () => performRequest('POST', `${supabaseUrl}/rest/v1/${table}`, data, supabaseKey, { columns, single: true })
        })
      })
    }),
    auth: {
      getUser: async (token) => {
        try {
          const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'apikey': supabaseKey
            }
          });
          
          if (!response.ok) throw new Error('Failed to get user');
          return { data: await response.json(), error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    },
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

// Generate a secure API key
function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 40;
  let result = '';
  
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % characters.length);
  }
  
  return result;
}

// Handle the webhook request
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log(`Received ${req.method} request to generate-webhook-key`);
  
  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Create a Supabase client
    const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get the user from the token
    const { data: user, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Check if the user is an admin
    const { data: isAdmin, error: adminCheckError } = await supabaseAdmin.rpc(
      'is_admin',
      { user_id: user.id }
    );
    
    if (adminCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin privileges required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Parse the request body
    const { key_name } = await req.json();
    
    if (!key_name) {
      return new Response(
        JSON.stringify({ error: 'Bad Request: Missing key_name parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Generate a new API key
    const apiKey = generateApiKey();
    
    // Store the API key
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('webhook_keys')
      .insert({
        key_name,
        api_key: apiKey,
        created_by: user.id
      })
      .select('id, key_name')
      .single();
    
    if (keyError) {
      console.error('Error storing API key:', keyError);
      return new Response(
        JSON.stringify({ error: 'Failed to store API key' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        key: {
          id: keyData.id,
          name: keyData.key_name,
          value: apiKey,
          created_at: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error generating webhook key:', error);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
