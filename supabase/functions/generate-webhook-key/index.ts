
// Import from the _shared/cors.ts file to maintain consistency
import { corsHeaders } from "../_shared/cors.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  console.log("Webhook key generation function started");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log("Request body:", JSON.stringify(body));
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Ensure key name exists and is properly extracted
    const keyName = body?.keyName;
    
    if (!keyName) {
      console.error("Missing keyName in request:", body);
      return new Response(
        JSON.stringify({ error: 'Key name is required', receivedData: body }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables:", { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!supabaseKey 
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing environment variables',
          details: { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Creating Supabase client with URL:", supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate a random key
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const key = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    console.log("Generated random key");
    
    // Extract user ID from auth header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (!error && user) {
          userId = user.id;
          console.log("Authenticated user ID:", userId);
        } else if (error) {
          console.error("Authentication error:", error);
        }
      } catch (authError) {
        console.error("Error during authentication:", authError);
      }
    } else {
      console.log("No valid auth header found, continuing without user authentication");
    }

    console.log("Checking if webhook_keys table exists");
    
    try {
      // First, let's check if the webhook_keys table exists
      const { error: tableCheckError } = await supabase
        .from('webhook_keys')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        if (tableCheckError.message.includes("relation") && tableCheckError.message.includes("does not exist")) {
          // Create the webhook_keys table if it doesn't exist
          console.log("webhook_keys table does not exist, creating it");
          
          const createTableQuery = `
            CREATE TABLE IF NOT EXISTS public.webhook_keys (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              key_name TEXT NOT NULL,
              api_key TEXT NOT NULL,
              created_by UUID,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
              last_used_at TIMESTAMP WITH TIME ZONE
            );
          `;
          
          const { error: createTableError } = await supabase.rpc('exec_sql', { query: createTableQuery });
          
          if (createTableError) {
            console.error("Error creating webhook_keys table:", createTableError);
            return new Response(
              JSON.stringify({ error: `Failed to set up webhook keys system: ${createTableError.message}` }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          console.log("Successfully created webhook_keys table");
        } else {
          return new Response(
            JSON.stringify({ error: `Database error: ${tableCheckError.message}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Now proceed with inserting the key
      console.log("Inserting key into database with params:", { 
        key_name: keyName, 
        api_key: key,
        created_by: userId
      });

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

      console.log("Key created successfully with ID:", data?.id);
      
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
