
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookKeyManager } from "../ai-integration/WebhookKeyManager";
import { WebhookQuestionReview } from "./question-review";

export const WebhookManagement = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keys">Webhook Keys</TabsTrigger>
          <TabsTrigger value="review">Question Review</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <WebhookKeyManager />
        </TabsContent>

        <TabsContent value="review">
          <WebhookQuestionReview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
