
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WebhookEndpointInfoProps {
  webhookUrl: string;
}

export function WebhookEndpointInfo({ webhookUrl }: WebhookEndpointInfoProps) {
  // Ensure the URL has a proper protocol and full domain
  const ensureFullUrl = (url: string): string => {
    if (!url) return "";
    
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

  const formattedUrl = ensureFullUrl(webhookUrl);
  console.log("WebhookEndpointInfo using URL:", formattedUrl);

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: description,
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">1. Webhook Endpoint URL</h3>
      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
        <code className="text-sm flex-1 overflow-x-auto">{formattedUrl}</code>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copyToClipboard(formattedUrl, "Webhook URL copied to clipboard")}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        This is the URL to use when configuring your webhook destination
      </p>
      
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Make sure your webhook URL is a fully qualified domain name (FQDN). 
          The URL should look like <code>https://dqaihawavxlacegykwqu.supabase.co/functions/v1/process-ai-webhook</code>, 
          not just <code>/functions/v1/process-ai-webhook</code>.
        </AlertDescription>
      </Alert>
    </div>
  );
}
