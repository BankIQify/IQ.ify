
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { WebhookKeysTable } from "./WebhookKeysTable";

export function WebhookKeysCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing Webhook Keys</CardTitle>
        <CardDescription>
          List of webhook keys that have been generated for this application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WebhookKeysTable />
      </CardContent>
    </Card>
  );
}
