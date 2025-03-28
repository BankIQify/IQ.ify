
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UsageExampleProps {
  webhookUrl: string;
}

export const UsageExample = ({ webhookUrl }: UsageExampleProps) => {
  // Create example payloads with correct structures
  const structuredQuestionsPayload = {
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

  const rawTextPayload = {
    sub_topic_id: "123e4567-e89b-12d3-a456-426614174000",
    sub_topic_name: "World Geography",
    raw_text: "1. What is the capital of France?\n2. What is the largest ocean on Earth?\n3. Which country has the largest population?"
  };

  const formattedStructuredJson = JSON.stringify(structuredQuestionsPayload, null, 2);
  const formattedRawTextJson = JSON.stringify(rawTextPayload, null, 2);
  
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
  
  // Create the curl commands for different header formats
  const curlCommandCustomHeader = `curl -X POST ${formattedWebhookUrl}\n-H "Content-Type: application/json"\n-H "x-webhook-key: YOUR_API_KEY"\n-d '${formattedStructuredJson}'`;
  
  const curlCommandAuthHeader = `curl -X POST ${formattedWebhookUrl}\n-H "Content-Type: application/json"\n-H "Authorization: Bearer YOUR_API_KEY"\n-d '${formattedStructuredJson}'`;

  return (
    <div className="space-y-4">
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
            Use this format for tools that expect standard Authorization headers
          </p>
        </TabsContent>
      </Tabs>
      
      <Tabs defaultValue="structured" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="structured">Structured Questions</TabsTrigger>
          <TabsTrigger value="rawtext">Raw Text</TabsTrigger>
        </TabsList>
        
        <TabsContent value="structured" className="space-y-2">
          <Label>JSON Example (Structured Questions)</Label>
          <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {formattedStructuredJson}
          </div>
          <CopyButton 
            text={formattedStructuredJson}
            description="Structured questions JSON example copied to clipboard"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Use this format when you have already structured questions with properties
          </p>
        </TabsContent>
        
        <TabsContent value="rawtext" className="space-y-2">
          <Label>JSON Example (Raw Text)</Label>
          <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {formattedRawTextJson}
          </div>
          <CopyButton 
            text={formattedRawTextJson}
            description="Raw text JSON example copied to clipboard"
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Use this format when you have unstructured text that needs to be parsed into questions
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
