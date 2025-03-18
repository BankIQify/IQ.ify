
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "./CopyButton";

interface UsageExampleProps {
  webhookUrl: string;
}

export const UsageExample = ({ webhookUrl }: UsageExampleProps) => {
  const sampleJsonPayload = {
    event_type: "question_generated",
    sub_topic_id: "uuid",
    questions: [
      {
        content: "What is the capital of France?",
        difficulty: "medium"
      }
    ]
  };

  const formattedJson = JSON.stringify(sampleJsonPayload, null, 2);

  return (
    <div className="space-y-2">
      <Label>How to Use</Label>
      <div className="bg-muted p-3 rounded-md text-sm font-mono">
        <p>curl -X POST {webhookUrl}</p>
        <p>-H "Content-Type: application/json"</p>
        <p>-H "x-webhook-key: YOUR_KEY_HERE"</p>
        <p>-d '{formattedJson}'</p>
      </div>
      <CopyButton 
        text={formattedJson}
        description="JSON example copied to clipboard"
        className="mt-2"
      />
    </div>
  );
};
