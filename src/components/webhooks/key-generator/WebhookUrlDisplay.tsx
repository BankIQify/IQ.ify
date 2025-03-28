
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "./CopyButton";

interface WebhookUrlDisplayProps {
  webhookUrl: string;
}

export const WebhookUrlDisplay = ({ webhookUrl }: WebhookUrlDisplayProps) => {
  return (
    <div className="space-y-2">
      <Label>Webhook URL</Label>
      <div className="flex items-center space-x-2">
        <Input value={webhookUrl} readOnly className="font-mono text-sm" />
        <CopyButton 
          text={webhookUrl} 
          description="Webhook URL copied to clipboard"
        />
      </div>
    </div>
  );
};
