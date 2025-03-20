
import { WebhookSetupCard } from "./webhook/WebhookSetupCard";
import { WebhookKeysCard } from "./webhook/WebhookKeysCard";

export function WebhookKeyManager() {
  // Get the Supabase URL from environment variable
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dqaihawavxlacegykwqu.supabase.co";
  
  // Log the Supabase URL for debugging
  console.log('Supabase URL from env:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Using Supabase URL:', supabaseUrl);
  
  // Ensure the URL has a proper protocol and is fully qualified
  const ensureFullUrl = (url: string): string => {
    if (!url) return "https://dqaihawavxlacegykwqu.supabase.co";
    
    // Check if URL has protocol
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    
    // Check if this is a partial URL (without domain)
    if (url.includes('functions/v1') && !url.includes('.supabase.co')) {
      // Replace with full URL pattern
      return `https://dqaihawavxlacegykwqu.supabase.co/functions/v1/process-ai-webhook`;
    }
    
    return url;
  };
  
  // Use the correct webhook URL that points to the Supabase function endpoint
  const formattedUrl = ensureFullUrl(supabaseUrl);
  const webhookUrl = formattedUrl.endsWith('/functions/v1/process-ai-webhook') 
    ? formattedUrl 
    : `${formattedUrl}/functions/v1/process-ai-webhook`;
  const functionEndpoint = `${formattedUrl}/functions/v1/generate-webhook-key`;
  
  console.log('Webhook URL configured as:', webhookUrl);
  console.log('Function endpoint configured as:', functionEndpoint);

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
