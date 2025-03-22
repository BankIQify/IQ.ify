
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createErrorResponse } from "../_shared/webhook-utils.ts";

export async function verifyWebhookKey(req: Request, supabaseUrl: string, supabaseServiceKey: string) {
  // Log all headers for debugging
  console.log('Request headers:');
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'authorization' && key.toLowerCase() !== 'x-webhook-key') {
      console.log(`${key}: ${value}`);
    } else {
      console.log(`${key}: [PRESENT]`);
    }
  });
  
  // Get webhook key from request headers - try multiple formats (case-insensitive)
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const customHeader = req.headers.get('x-webhook-key') || req.headers.get('X-Webhook-Key');
  
  console.log('Webhook request received, checking authorization');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Auth header present:', !!authHeader);
  console.log('X-webhook-key header present:', !!customHeader);
  
  let webhookKey = null;
  
  // Try to get key from custom header first (preferred for Make.com)
  if (customHeader) {
    webhookKey = customHeader.trim();
    console.log('Using key from x-webhook-key header');
  }
  // Try to get key from Authorization header as fallback
  else if (authHeader) {
    // Check if it has Bearer prefix and extract key
    if (authHeader.startsWith('Bearer ')) {
      webhookKey = authHeader.substring(7).trim();
      console.log('Using key from Authorization header with Bearer prefix');
    } else {
      // Use the raw Authorization header value
      webhookKey = authHeader.trim();
      console.log('Using key from Authorization header without Bearer prefix');
    }
  }
  
  if (!webhookKey) {
    console.error('Missing webhook key in headers (tried both x-webhook-key and Authorization)');
    return { 
      valid: false, 
      response: createErrorResponse('Unauthorized: Missing webhook key in headers. Please include either x-webhook-key or Authorization header.', 401)
    };
  }

  // Create a Supabase client
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.');
    return { 
      valid: false, 
      response: createErrorResponse('Server configuration error', 500)
    };
  }
  
  // Ensure Supabase URL is properly formatted
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}`;
  }
  
  try {
    console.log('Creating Supabase admin client');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check the webhook key against the database
    console.log('Attempting to verify webhook key in database');
    const { data: keyCheck, error: keyCheckError } = await supabaseAdmin
      .from('webhook_keys')
      .select('id, key_name')
      .eq('api_key', webhookKey)
      .maybeSingle();

    if (keyCheckError) {
      console.error('Error checking webhook key:', keyCheckError);
      return { 
        valid: false, 
        response: createErrorResponse(`Database error checking webhook key: ${keyCheckError.message}`, 500)
      };
    }

    if (!keyCheck) {
      console.error('Invalid webhook key provided');
      return { 
        valid: false, 
        response: createErrorResponse('Unauthorized: Invalid webhook key', 401)
      };
    }

    console.log(`Webhook key verification successful for key: ${keyCheck.key_name} (${keyCheck.id})`);
    
    // Update last_used_at timestamp for the key
    await supabaseAdmin
      .from('webhook_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyCheck.id);
      
    return { valid: true, supabaseAdmin };
  } catch (error) {
    console.error('Unexpected error verifying webhook key:', error);
    return {
      valid: false,
      response: createErrorResponse(`Server error verifying webhook key: ${error.message}`, 500)
    };
  }
}
