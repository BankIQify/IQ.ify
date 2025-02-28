
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookKeyManager } from "./WebhookKeyManager";
import { WebhookInfoCard } from "./WebhookInfoCard";
import { ChatConversationList } from "./ChatConversationList";

export function AIIntegrationPanel() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>
      
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="mt-6">
          <ChatConversationList />
        </TabsContent>
        
        <TabsContent value="setup" className="mt-6">
          <WebhookInfoCard />
        </TabsContent>
        
        <TabsContent value="keys" className="mt-6">
          <WebhookKeyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
