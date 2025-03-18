
import { WebhookSetupCard } from "./webhook/WebhookSetupCard";
import { WebhookKeysCard } from "./webhook/WebhookKeysCard";

export function WebhookKeyManager() {
  // Get the Supabase URL from environment variable
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Ensure we have a valid Supabase URL
  if (!supabaseUrl) {
    console.error("VITE_SUPABASE_URL environment variable is not defined");
  }
  
  // Use the correct webhook URL that points to the Supabase function endpoint
  const webhookUrl = `${supabaseUrl}/functions/v1/process-ai-webhook`;
  const functionEndpoint = `${supabaseUrl}/functions/v1/generate-webhook-key`;

  return (
    <div className="space-y-6">
      <WebhookSetupCard 
        webhookUrl={webhookUrl} 
        functionEndpoint={functionEndpoint} 
      />
      <WebhookKeysCard />
    </div>
  );
}
