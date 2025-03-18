
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WebhookEndpointInfoProps {
  webhookUrl: string;
}

export function WebhookEndpointInfo({ webhookUrl }: WebhookEndpointInfoProps) {
  // Ensure the URL has a proper protocol
  const ensureProtocol = (url: string): string => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) {
      // If no protocol is specified, add https://
      return `https://${url}`;
    }
    return url;
  };

  const formattedUrl = ensureProtocol(webhookUrl);

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
          <strong>Important:</strong> Make sure your webhook URL starts with <code>http://</code> or <code>https://</code> when configuring in Make.com or other services. 
          Invalid protocols will cause connection errors.
        </AlertDescription>
      </Alert>
    </div>
  );
}
