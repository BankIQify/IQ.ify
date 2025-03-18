
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
  
  // Create the curl command that accurately reflects the endpoint being used
  const curlCommand = `curl -X POST ${webhookUrl}\n-H "Content-Type: application/json"\n-H "x-webhook-key: YOUR_KEY_HERE"\n-d '${formattedJson}'`;

  return (
    <div className="space-y-2">
      <Label>How to Use</Label>
      <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
        {curlCommand}
      </div>
      <CopyButton 
        text={formattedJson}
        description="JSON example copied to clipboard"
        className="mt-2"
      />
    </div>
  );
};
