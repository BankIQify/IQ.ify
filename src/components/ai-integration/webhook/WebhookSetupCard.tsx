
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { WebhookEndpointInfo } from "./WebhookEndpointInfo";
import { ApiKeyGenerationInfo } from "./ApiKeyGenerationInfo";
import { HeaderFormatInfo } from "./HeaderFormatInfo";

interface WebhookSetupCardProps {
  webhookUrl: string;
  functionEndpoint: string;
}

export function WebhookSetupCard({ webhookUrl, functionEndpoint }: WebhookSetupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Integration Information</CardTitle>
        <CardDescription>
          Use these details to set up your webhook integrations with Make or other services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <WebhookEndpointInfo webhookUrl={webhookUrl} />
        <ApiKeyGenerationInfo functionEndpoint={functionEndpoint} />
        <HeaderFormatInfo />
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => window.open("https://www.postman.com/downloads/", "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Get Postman
        </Button>
      </CardFooter>
    </Card>
  );
}
