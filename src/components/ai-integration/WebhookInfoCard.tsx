
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
          Complete reference for webhook integration with external services
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
            Use this URL as the webhook destination
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1">2. Authentication Headers</h3>
          <div className="bg-muted p-2 rounded text-sm">
            <p className="font-medium">Use one of these authentication options:</p>
            <pre className="mt-1">x-webhook-key: YOUR_API_KEY</pre>
            <p className="text-xs text-muted-foreground mt-1">OR</p>
            <pre className="mt-1">Authorization: Bearer YOUR_API_KEY</pre>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Include one of these headers with your raw API key in all webhook requests
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-1">3. API Key Generation</h3>
          <div className="grid grid-cols-3 gap-2 text-sm bg-muted p-3 rounded-md">
            <div className="font-medium">Method:</div>
            <div className="col-span-2">POST</div>
            
            <div className="font-medium">URL:</div>
            <div className="col-span-2">
              <code className="text-xs">{`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-webhook-key`}</code>
            </div>
            
            <div className="font-medium">Headers:</div>
            <div className="col-span-2">
              <code className="text-xs">Content-Type: application/json</code>
            </div>
            
            <div className="font-medium">Request Body:</div>
            <div className="col-span-2">
              <pre className="text-xs bg-muted p-2 rounded-md">
                {"{\n  \"keyName\": \"Your Key Name\"\n}"}
              </pre>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-1">4. Payload Format Example</h3>
          <div className="bg-muted p-2 rounded text-sm overflow-x-auto">
            <pre>{`{
  "event_type": "question_generated",
  "sub_topic_id": "uuid-of-subtopic",
  "questions": [
    {
      "content": "Question text?",
      "difficulty": "medium"
    }
  ]
}`}</pre>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-4"
          onClick={() => window.open("https://supabase.com/docs/guides/functions", "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Supabase Functions Documentation
        </Button>
      </CardContent>
    </Card>
  );
}
