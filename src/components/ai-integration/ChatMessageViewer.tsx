
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  tokens_used?: number;
}

interface ChatMessageViewerProps {
  conversationId: string;
  onBack: () => void;
}

export function ChatMessageViewer({ conversationId, onBack }: ChatMessageViewerProps) {
  const [conversation, setConversation] = useState<{ title: string } | null>(null);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['chat-messages', conversationId],
    queryFn: async () => {
      // Get conversation details
      const { data: convData, error: convError } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (convError) throw convError;
      setConversation(convData);
      
      // Get messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at');
      
      if (messagesError) throw messagesError;
      return messagesData as Message[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Messages</CardTitle>
          <CardDescription>
            There was a problem loading conversation messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{(error as Error).message}</p>
          <Button onClick={onBack} className="mt-4">
            Back to Conversations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <CardTitle>{conversation?.title || "Conversation"}</CardTitle>
          <CardDescription>
            {messages?.length || 0} messages
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "assistant"
                  ? "bg-primary/10 ml-10"
                  : message.role === "user"
                  ? "bg-muted mr-10"
                  : "bg-secondary/20 border border-secondary/40 text-xs"
              }`}
            >
              <div className="text-xs font-medium mb-1 text-muted-foreground">
                {message.role === "assistant" ? "AI Assistant" : message.role === "user" ? "You" : "System"}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.tokens_used && (
                <div className="text-xs text-muted-foreground mt-2">
                  Tokens: {message.tokens_used}
                </div>
              )}
            </div>
          ))}

          {!messages?.length && (
            <div className="py-8 text-center text-muted-foreground">
              No messages in this conversation
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
