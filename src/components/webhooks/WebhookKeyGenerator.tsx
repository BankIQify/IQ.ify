
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";
import { useWebhookKeyGeneration } from "./hooks/useWebhookKeyGeneration";
import { KeyNameInput } from "./key-generator/KeyNameInput";
import { WebhookKeyDisplay } from "./key-generator/WebhookKeyDisplay";
import { WebhookUrlDisplay } from "./key-generator/WebhookUrlDisplay";
import { UsageExample } from "./key-generator/UsageExample";
import { ErrorDisplay } from "./key-generator/ErrorDisplay";

export const WebhookKeyGenerator = () => {
  const {
    keyName,
    setKeyName,
    generatingKey,
    webhookKey,
    webhookUrl,
    error,
    generateKey
  } = useWebhookKeyGeneration();

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Generate Webhook Key</CardTitle>
        <CardDescription>
          Create a secure key to authenticate external AI systems that send data to your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ErrorDisplay error={error} />
        
        <KeyNameInput keyName={keyName} setKeyName={setKeyName} />

        {webhookKey && <WebhookKeyDisplay webhookKey={webhookKey} />}

        <WebhookUrlDisplay webhookUrl={webhookUrl} />

        <UsageExample webhookUrl={webhookUrl} />
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
