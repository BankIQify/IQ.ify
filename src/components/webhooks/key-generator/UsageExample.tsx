
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UsageExampleProps {
  webhookUrl: string;
}

export const UsageExample = ({ webhookUrl }: UsageExampleProps) => {
  const sampleJsonPayload = {
    event_type: "question_generated",
    sub_topic_id: "123e4567-e89b-12d3-a456-426614174000",
    questions: [
      {
        content: "What is the capital of France?",
        difficulty: "medium"
      },
      {
        content: "Who wrote 'Romeo and Juliet'?",
        difficulty: "easy"
      }
    ],
    prompt: "Generate basic knowledge questions"
  };

  const formattedJson = JSON.stringify(sampleJsonPayload, null, 2);
  
  // Ensure the webhook URL is fully qualified
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
  
  const formattedWebhookUrl = ensureFullUrl(webhookUrl);
  console.log("Usage example using webhook URL:", formattedWebhookUrl);
  
  // Create the curl commands for different header formats
  const curlCommandCustomHeader = `curl -X POST ${formattedWebhookUrl}\n-H "Content-Type: application/json"\n-H "x-webhook-key: YOUR_KEY_HERE"\n-d '${formattedJson}'`;
  
  const curlCommandAuthHeader = `curl -X POST ${formattedWebhookUrl}\n-H "Content-Type: application/json"\n-H "Authorization: Bearer YOUR_KEY_HERE"\n-d '${formattedJson}'`;

  return (
    <div className="space-y-2">
      <Label>How to Use</Label>
      
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="custom">Custom Header</TabsTrigger>
          <TabsTrigger value="auth">Auth Header</TabsTrigger>
        </TabsList>
        
        <TabsContent value="custom" className="space-y-2">
          <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {curlCommandCustomHeader}
          </div>
          <CopyButton 
            text={curlCommandCustomHeader}
            description="cURL command with custom header copied to clipboard"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground">
            Use this format for tools that support custom headers
          </p>
        </TabsContent>
        
        <TabsContent value="auth" className="space-y-2">
          <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {curlCommandAuthHeader}
          </div>
          <CopyButton 
            text={curlCommandAuthHeader}
            description="cURL command with Authorization header copied to clipboard"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground">
            Use this format for tools that expect standard Authorization headers like Make or Postman
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Label>JSON Example</Label>
        <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap mt-2">
          {formattedJson}
        </div>
        <CopyButton 
          text={formattedJson}
          description="JSON example copied to clipboard"
          className="mt-2"
        />
      </div>
    </div>
  );
};
