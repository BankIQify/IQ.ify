
import { WebhookSetupCard } from "./webhook/WebhookSetupCard";
import { WebhookKeysCard } from "./webhook/WebhookKeysCard";

export function WebhookKeyManager() {
  const webhookUrl = `${window.location.origin.replace(/^http/, 'https')}/api/process-webhook`;
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
