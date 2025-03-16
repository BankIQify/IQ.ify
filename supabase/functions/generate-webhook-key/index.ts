
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
    console.log("Starting webhook key generation function");
    
    // Get request body
    let keyName;
    try {
      const body = await req.json();
      keyName = body.keyName;
      console.log("Request body parsed successfully:", { keyName });
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!keyName) {
      console.log("Error: Missing key name in request");
      return new Response(
        JSON.stringify({ error: 'Key name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log("Supabase URL available:", !!supabaseUrl);
    console.log("Supabase key available:", !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey 
      });
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Creating Supabase client");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a random key
    console.log("Generating random key");
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log("Key generated successfully");
    
    // Extract user ID from auth header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log("Attempting to get user from token");
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          userId = user.id;
          console.log("Authenticated user ID:", userId);
        } else if (error) {
          console.error("Auth error:", error);
        }
      } catch (authError) {
        console.error("Error during authentication:", authError);
      }
    } else {
      console.log("No valid auth header found, proceeding without user authentication");
    }

    // Insert the webhook key into the database
    console.log("Inserting key into database");
    try {
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
          JSON.stringify({ error: `Failed to create webhook key: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log("Key created successfully with ID:", data.id);
      
      return new Response(
        JSON.stringify({ success: true, key }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return new Response(
        JSON.stringify({ error: `Database operation failed: ${dbError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unhandled error in generate-webhook-key function:', error);
    
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
