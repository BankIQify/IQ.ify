
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clipboard, RefreshCcw } from "lucide-react";

export const WebhookKeyGenerator = () => {
  const [keyName, setKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [webhookKey, setWebhookKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const { toast } = useToast();

  // Get webhook URL based on current domain
  useState(() => {
    const baseUrl = window.location.origin;
    setWebhookUrl(`${baseUrl}/.netlify/functions/webhook-processor`);
  }, []);

  const generateKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your webhook key",
        variant: "destructive",
      });
      return;
    }

    setGeneratingKey(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-webhook-key", {
        body: { keyName },
      });

      if (error) throw error;
      setWebhookKey(data.key);
      toast({
        title: "Success",
        description: "Webhook key generated successfully",
      });
    } catch (error) {
      console.error("Error generating webhook key:", error);
      toast({
        title: "Error",
        description: "Failed to generate webhook key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string, type: "key" | "url") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `The webhook ${type} has been copied to your clipboard.`,
    });
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Webhook Key</CardTitle>
        <CardDescription>
          Create a secure key to authenticate external AI systems that send data to your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="keyName">Key Name</Label>
          <Input
            id="keyName"
            placeholder="e.g., Production AI, Test System"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
        </div>

        {webhookKey && (
          <div className="space-y-2">
            <Label>Your Webhook Key</Label>
            <div className="flex items-center space-x-2">
              <Input value={webhookKey} readOnly className="font-mono text-sm" />
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => copyToClipboard(webhookKey, "key")}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Store this key securely. It will not be displayed again.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <div className="flex items-center space-x-2">
            <Input value={webhookUrl} readOnly className="font-mono text-sm" />
            <Button 
              size="icon" 
              variant="outline" 
              onClick={() => copyToClipboard(webhookUrl, "url")}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>How to Use</Label>
          <div className="bg-muted p-3 rounded-md text-sm font-mono">
            <p>curl -X POST {webhookUrl}</p>
            <p>-H "Content-Type: application/json"</p>
            <p>-H "x-webhook-key: YOUR_KEY_HERE"</p>
            <p>-d '&#123; "event_type": "question_generated", "sub_topic_id": "uuid", "questions": [...] &#125;'</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateKey} disabled={generatingKey} className="w-full">
          {generatingKey ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Webhook Key"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
