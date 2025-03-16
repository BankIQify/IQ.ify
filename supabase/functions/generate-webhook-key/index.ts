
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { keyName } = await req.json();
    
    console.log("Processing webhook key generation request for key name:", keyName);
    
    if (!keyName) {
      console.log("Error: Missing key name in request");
      return new Response(
        JSON.stringify({ error: 'Key name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("Error: Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a random key
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log("Generated key successfully");
    
    // Extract user ID from auth header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (!error && user) {
        userId = user.id;
        console.log("Authenticated user ID:", userId);
      } else if (error) {
        console.log("Auth error:", error);
      }
    } else {
      console.log("No valid auth header found");
    }

    // Insert the webhook key into the database
    console.log("Inserting key into database");
    const { data, error } = await supabase
      .from('webhook_keys')
      .insert({
        key_name: keyName,
        api_key: key,
        created_by: userId,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting webhook key:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create webhook key' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Key created successfully with ID:", data.id);
    
    return new Response(
      JSON.stringify({ success: true, key }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-webhook-key function:', error);
    
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
