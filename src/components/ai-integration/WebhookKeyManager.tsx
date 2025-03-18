
import { WebhookSetupCard } from "./webhook/WebhookSetupCard";
import { WebhookKeysCard } from "./webhook/WebhookKeysCard";

export function WebhookKeyManager() {
  // Get the Supabase URL from environment variable
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  // Ensure we have a valid Supabase URL
  if (!supabaseUrl) {
    console.error("VITE_SUPABASE_URL environment variable is not defined");
  }
  
  // Ensure the URL has a proper protocol
  const ensureProtocol = (url: string): string => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      // If no protocol is specified, add https://
      return `https://${url}`;
    }
    return url;
  };
  
  // Use the correct webhook URL that points to the Supabase function endpoint
  const formattedUrl = ensureProtocol(supabaseUrl);
  const webhookUrl = `${formattedUrl}/functions/v1/process-ai-webhook`;
  const functionEndpoint = `${formattedUrl}/functions/v1/generate-webhook-key`;
  
  console.log('Webhook URL configured as:', webhookUrl);

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
