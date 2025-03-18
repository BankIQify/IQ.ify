
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createErrorResponse } from "../_shared/webhook-utils.ts";

export async function verifyWebhookKey(req: Request, supabaseUrl: string, supabaseServiceKey: string) {
  // Get webhook key for authentication
  const webhookKey = req.headers.get('x-webhook-key');
  
  if (!webhookKey) {
    console.error('Missing webhook key');
    return { 
      valid: false, 
      response: createErrorResponse('Unauthorized: Missing webhook key', 401)
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
  
  console.log('Creating Supabase admin client with URL:', supabaseUrl);
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify the webhook key
  try {
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
