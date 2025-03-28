
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface WebhookKeyDisplayProps {
  webhookKey: string;
}

export const WebhookKeyDisplay = ({ webhookKey }: WebhookKeyDisplayProps) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-2">
      <Label>Your Webhook Key</Label>
      <div className="flex items-center space-x-2">
        <Input 
          value={webhookKey} 
          readOnly 
          className="font-mono text-sm" 
          type={showKey ? "text" : "password"}
        />
        <CopyButton 
          text={webhookKey} 
          description="Webhook key copied to clipboard"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Store this key securely. It will not be displayed again.
      </p>
    </div>
  );
};
