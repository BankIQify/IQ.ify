
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
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verify the webhook key
  const { data: keyCheck, error: keyCheckError } = await supabaseAdmin
    .from('webhook_keys')
    .select('id')
    .eq('api_key', webhookKey)
    .maybeSingle();

  if (keyCheckError || !keyCheck) {
    console.error('Invalid webhook key or error checking key', keyCheckError);
    return { 
      valid: false, 
      response: createErrorResponse('Unauthorized: Invalid webhook key', 401)
    };
  }

  return { valid: true, supabaseAdmin };
}
