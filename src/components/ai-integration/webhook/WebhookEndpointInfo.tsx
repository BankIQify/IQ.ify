
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WebhookEndpointInfoProps {
  webhookUrl: string;
}

export function WebhookEndpointInfo({ webhookUrl }: WebhookEndpointInfoProps) {
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
        <code className="text-sm flex-1 overflow-x-auto">{webhookUrl}</code>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copyToClipboard(webhookUrl, "Webhook URL copied to clipboard")}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        This is the URL to use when configuring your webhook destination
      </p>
    </div>
  );
}
