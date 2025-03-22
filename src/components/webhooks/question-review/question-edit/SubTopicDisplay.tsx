
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SubTopicDisplayProps {
  subTopicId?: string;
}

export const SubTopicDisplay = ({ subTopicId }: SubTopicDisplayProps) => {
  const { data: subTopic, isLoading } = useQuery({
    queryKey: ['subTopic', subTopicId],
    queryFn: async () => {
      if (!subTopicId) return null;
      
      const { data, error } = await supabase
        .from('sub_topics')
        .select('id, name')
        .eq('id', subTopicId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!subTopicId,
  });

  if (!subTopicId) return null;
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading subtopic details...</div>;
  
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">Subtopic: </span>
      <span className="font-medium">{subTopic?.name || 'Unknown'}</span>
      <span className="text-xs text-muted-foreground ml-2">({subTopicId})</span>
    </div>
  );
};
