
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebhookKeyManager } from "./WebhookKeyManager";
import { WebhookInfoCard } from "./WebhookInfoCard";
import { ChatConversationList } from "./ChatConversationList";
import { ChatMessageViewer } from "./ChatMessageViewer";

export function AIIntegrationPanel() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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
          {selectedConversationId ? (
            <ChatMessageViewer 
              conversationId={selectedConversationId}
              onBack={() => setSelectedConversationId(null)}
            />
          ) : (
            <ChatConversationList 
              onSelectConversation={(id) => setSelectedConversationId(id)}
            />
          )}
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
