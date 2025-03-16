
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clipboard, RefreshCcw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WebhookKeyGenerator = () => {
  const [keyName, setKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [webhookKey, setWebhookKey] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
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
    setError(null);
    
    try {
      console.log('Generating webhook key with name:', keyName);
      
      const { data, error } = await supabase.functions.invoke("generate-webhook-key", {
        body: { keyName: keyName.trim() }
      });
      
      console.log('Response from generate-webhook-key:', { data, error });
      
      if (error) {
        console.error("Supabase functions error:", error);
        throw new Error(error.message || "Failed to connect to the server");
      }
      
      if (!data) {
        throw new Error('No data returned from the server');
      }
      
      if (!data.key && !data.success) {
        throw new Error(data.error || 'Server returned an invalid response');
      }
      
      setWebhookKey(data.key);
      toast({
        title: "Success",
        description: "Webhook key generated successfully",
      });
    } catch (error) {
      console.error("Error generating webhook key:", error);
      setError(error.message || "Failed to generate webhook key. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Failed to generate webhook key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingKey(false);
    }
  };

  const copyToClipboard = (text: string, type: "key" | "url" | "json") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `The webhook ${type} has been copied to your clipboard.`,
    });
  };

  const sampleJsonPayload = {
    event_type: "question_generated",
    sub_topic_id: "uuid",
    questions: [
      {
        question: "What is the capital of France?",
        explanation: "Paris is the capital and most populous city of France.",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
        difficulty: "medium"
      }
    ]
  };

  const formattedJson = JSON.stringify(sampleJsonPayload, null, 2);

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Webhook Key</CardTitle>
        <CardDescription>
          Create a secure key to authenticate external AI systems that send data to your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
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
            <p>-d '{formattedJson}'</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2"
            onClick={() => copyToClipboard(formattedJson, "json")}
          >
            <Clipboard className="h-4 w-4 mr-2" /> Copy JSON Example
          </Button>
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
