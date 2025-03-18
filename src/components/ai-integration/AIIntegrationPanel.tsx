
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationsTab } from "./tabs/ConversationsTab";
import { SetupGuideTab } from "./tabs/SetupGuideTab";
import { ApiKeysTab } from "./tabs/ApiKeysTab";
import { MessageSquare, FileText, Key } from "lucide-react";

export function AIIntegrationPanel() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">OpenAI Integration</h1>
      
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Conversations</span>
          </TabsTrigger>
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Setup Guide</span>
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="mt-6">
          <ConversationsTab />
        </TabsContent>
        
        <TabsContent value="setup" className="mt-6">
          <SetupGuideTab />
        </TabsContent>
        
        <TabsContent value="keys" className="mt-6">
          <ApiKeysTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
