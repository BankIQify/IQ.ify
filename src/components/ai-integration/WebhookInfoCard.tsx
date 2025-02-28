
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function WebhookInfoCard() {
  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-ai-webhook`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: "Webhook URL copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy URL",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Integration Guide</CardTitle>
        <CardDescription>
          Configure your Make (Integromat) webhook to connect with this application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">1. Webhook URL</h3>
          <div className="flex items-center">
            <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto">
              {webhookUrl}
            </code>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => copyToClipboard(webhookUrl)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Use this URL in your Make scenario as the webhook destination
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1">2. Authentication Header</h3>
          <div className="bg-muted p-2 rounded text-sm">
            <pre>x-webhook-key: YOUR_API_KEY</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Include this header with the API key you generated
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1">3. Payload Format - Conversation Created</h3>
          <div className="bg-muted p-2 rounded text-sm overflow-x-auto">
            <pre>{`{
  "event_type": "conversation_created",
  "user_id": "auth-user-id",
  "title": "Conversation Title"
}`}</pre>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-1">4. Payload Format - Message Created</h3>
          <div className="bg-muted p-2 rounded text-sm overflow-x-auto">
            <pre>{`{
  "event_type": "message_created",
  "conversation_id": "existing-conversation-id",
  "role": "user", // or "assistant" or "system"
  "content": "Message content text",
  "tokens_used": 150 // optional
}`}</pre>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-4"
          onClick={() => window.open("https://www.make.com/en/help/apps/connections/webhooks", "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Make Webhooks Documentation
        </Button>
      </CardContent>
    </Card>
  );
}
