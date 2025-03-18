
import { WebhookSetupCard } from "./webhook/WebhookSetupCard";
import { WebhookKeysCard } from "./webhook/WebhookKeysCard";

export function WebhookKeyManager() {
  // Ensure the webhook URL has the correct protocol
  const origin = window.location.origin;
  const webhookUrl = origin.startsWith('http') 
    ? `${origin}/api/process-webhook`
    : `https://${origin.replace(/^https?:\/\//, '')}/api/process-webhook`;
    
  const functionEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-webhook-key`;

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
