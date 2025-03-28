
import { useState } from "react";
import { ChatConversationList } from "../ChatConversationList";
import { ChatMessageViewer } from "../ChatMessageViewer";

export function ConversationsTab() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <>
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
    </>
  );
}
