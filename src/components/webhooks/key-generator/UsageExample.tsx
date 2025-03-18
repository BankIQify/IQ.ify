
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";

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
  
  // Ensure the webhook URL has a proper protocol
  const ensureProtocol = (url: string): string => {
    if (!url) return "";
    if (!/^https?:\/\//i.test(url)) {
      // If no protocol is specified, add https://
      return `https://${url}`;
    }
    return url;
  };
  
  const formattedWebhookUrl = ensureProtocol(webhookUrl);
  
  // Create the curl command that accurately reflects the endpoint being used
  const curlCommand = `curl -X POST ${formattedWebhookUrl}\n-H "Content-Type: application/json"\n-H "x-webhook-key: YOUR_KEY_HERE"\n-d '${formattedJson}'`;

  return (
    <div className="space-y-2">
      <Label>How to Use</Label>
      <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
        {curlCommand}
      </div>
      <CopyButton 
        text={curlCommand}
        description="cURL command copied to clipboard"
        className="mt-2 mr-2"
      />
      <CopyButton 
        text={formattedJson}
        description="JSON example copied to clipboard"
        className="mt-2"
      />
    </div>
  );
};
