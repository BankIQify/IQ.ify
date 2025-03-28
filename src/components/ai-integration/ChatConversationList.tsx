
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, RefreshCw } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

interface ChatConversationListProps {
  onSelectConversation?: (conversationId: string) => void;
}

export function ChatConversationList({ onSelectConversation }: ChatConversationListProps = {}) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const { data: conversations, isLoading, error, refetch } = useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      // First get all conversations using a raw query
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      // Then get message counts for each conversation using raw counts
      const conversationsWithCounts = await Promise.all(
        conversationsData.map(async (conversation) => {
          const { count, error: countError } = await supabase
            .from('ai_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id);
          
          return {
            ...conversation,
            message_count: countError ? 0 : count || 0
          };
        })
      );
      
      return conversationsWithCounts as Conversation[];
    },
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Conversation list has been refreshed",
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    if (onSelectConversation) {
      onSelectConversation(conversationId);
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Conversations</CardTitle>
          <CardDescription>
            There was a problem loading your AI conversations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{(error as Error).message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>AI Chat Conversations</CardTitle>
          <CardDescription>
            Your conversations from the OpenAI integration
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Loading conversations...</p>
          </div>
        ) : conversations && conversations.length > 0 ? (
          <ul className="space-y-3">
            {conversations.map((conversation) => (
              <li 
                key={conversation.id}
                className={`p-3 rounded-md border cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium truncate">{conversation.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="mr-1 h-3.5 w-3.5" />
                      <span>{conversation.message_count} messages</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p>No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Conversations from your OpenAI integration will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
