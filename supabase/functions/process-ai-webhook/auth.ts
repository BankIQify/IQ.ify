
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createErrorResponse } from "../_shared/webhook-utils.ts";

export async function verifyWebhookKey(req: Request, supabaseUrl: string, supabaseServiceKey: string) {
  // Get webhook key from either x-webhook-key or Authorization header
  let webhookKey = req.headers.get('x-webhook-key');
  let isJwtToken = false;
  
  // Check for Authorization header if x-webhook-key is not present
  if (!webhookKey) {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    
    if (authHeader) {
      // Handle both "Bearer <key>" and plain "<key>" formats
      if (authHeader.startsWith('Bearer ')) {
        webhookKey = authHeader.substring(7).trim();
        // Check if this looks like a JWT (has two dots for three segments)
        isJwtToken = webhookKey.split('.').length === 3;
        console.log('Using key from Authorization header with Bearer prefix, JWT format:', isJwtToken);
      } else {
        webhookKey = authHeader.trim();
        console.log('Using key from Authorization header without Bearer prefix');
      }
    }
  }
  
  console.log('Webhook request received, checking authorization');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  console.log('Headers present:', [...req.headers.keys()].join(', '));
  console.log('Header types found:', 
    req.headers.has('x-webhook-key') ? 'x-webhook-key' : 'No x-webhook-key', 
    req.headers.has('authorization') || req.headers.has('Authorization') ? 'Authorization' : 'No Authorization'
  );
  console.log('Supabase URL being used:', supabaseUrl);
  
  if (!webhookKey) {
    console.error('Missing webhook key in headers (tried both x-webhook-key and Authorization)');
    return { 
      valid: false, 
      response: createErrorResponse('Unauthorized: Missing webhook key in both x-webhook-key and Authorization headers', 401)
    };
  }

  // Create a Supabase client
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are missing.');
    console.error('SUPABASE_URL present:', !!supabaseUrl);
    console.error('SUPABASE_SERVICE_ROLE_KEY present:', !!supabaseServiceKey);
    return { 
      valid: false, 
      response: createErrorResponse('Server configuration error', 500)
    };
  }
  
  // Ensure Supabase URL is properly formatted with https:// prefix
  if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = `https://${supabaseUrl}`;
    console.log('Updated Supabase URL with https:// prefix:', supabaseUrl);
  }
  
  console.log('Creating Supabase admin client with URL:', supabaseUrl);
  
  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // If it's a JWT token, we need to validate it differently
    if (isJwtToken) {
      console.log('Validating JWT token format');
      
      try {
        // For JWT tokens, we just check if they're valid API keys in the database
        // We're not decoding/verifying the JWT structure here since we don't have the secret
        // Instead, we're checking if this token is registered in our webhook_keys table
        const { data: keyCheck, error: keyCheckError } = await supabaseAdmin
          .from('webhook_keys')
          .select('id')
          .eq('api_key', webhookKey)
          .maybeSingle();
          
        if (keyCheckError) {
          console.error('Error checking JWT as webhook key:', keyCheckError);
          return { 
            valid: false, 
            response: createErrorResponse(`Database error checking webhook key: ${keyCheckError.message}`, 500)
          };
        }

        if (!keyCheck) {
          console.error('Invalid JWT token provided');
          return { 
            valid: false, 
            response: createErrorResponse('Unauthorized: Invalid JWT token', 401)
          };
        }
        
        console.log('JWT token validation successful');
        return { valid: true, supabaseAdmin };
      } catch (jwtError) {
        console.error('Error validating JWT token:', jwtError);
        return {
          valid: false,
          response: createErrorResponse(`Invalid JWT token format: ${jwtError.message}`, 401)
        };
      }
    }
    
    // For regular API keys, verify against the webhook_keys table
    console.log('Attempting to verify webhook key in database');
    const { data: keyCheck, error: keyCheckError } = await supabaseAdmin
      .from('webhook_keys')
      .select('id')
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

    console.log('Webhook key verification successful');
    return { valid: true, supabaseAdmin };
  } catch (error) {
    console.error('Unexpected error verifying webhook key:', error);
    return {
      valid: false,
      response: createErrorResponse(`Server error verifying webhook key: ${error.message}`, 500)
    };
  }
}
