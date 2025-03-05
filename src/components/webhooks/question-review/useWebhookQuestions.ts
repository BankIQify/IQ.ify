
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WebhookEvent, QuestionItem } from "./types";
import type { QuestionType } from "@/types/questions";

export const useWebhookQuestions = () => {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<QuestionItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWebhookEvents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("webhook_events")
          .select("*")
          .eq("event_type", "question_generated")
          .eq("processed", false)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWebhookEvents(data || []);
      } catch (error) {
        console.error("Error fetching webhook events:", error);
        toast({
          title: "Error",
          description: "Failed to fetch webhook events",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebhookEvents();
    
    const interval = setInterval(fetchWebhookEvents, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleSelectEvent = (event: WebhookEvent) => {
    setSelectedEvent(event);
    if (event.payload && event.payload.questions) {
      setEditedQuestions(event.payload.questions);
    }
  };

  const handleUpdateQuestion = (index: number, updatedQuestion: QuestionItem) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[index] = updatedQuestion;
    setEditedQuestions(updatedQuestions);
  };

  const handleSaveQuestions = async () => {
    if (!selectedEvent || !editedQuestions.length) return;
    
    setIsLoading(true);
    try {
      const subTopicId = selectedEvent.payload.sub_topic_id;
      
      if (!subTopicId) {
        throw new Error("No sub-topic ID provided in webhook payload");
      }
      
      for (const question of editedQuestions) {
        const questionContent = {
          question: question.question,
          explanation: question.explanation || "No explanation provided",
        };
        
        if (question.options && question.correctAnswer) {
          questionContent.options = question.options;
          questionContent.correctAnswer = question.correctAnswer;
        } else if (question.primaryOptions && question.secondaryOptions) {
          questionContent.primaryOptions = question.primaryOptions;
          questionContent.secondaryOptions = question.secondaryOptions;
          questionContent.correctPrimaryAnswer = question.correctPrimaryAnswer;
          questionContent.correctSecondaryAnswer = question.correctSecondaryAnswer;
        }
        
        let questionType: QuestionType = question.options ? "multiple_choice" : 
                          (question.imageUrl ? "image" : "text");
                          
        // Map dual_choice to multiple_choice for database compatibility
        if (question.primaryOptions && question.secondaryOptions) {
          questionType = "multiple_choice";
        }
        
        const { error: insertError } = await supabase
          .from("questions")
          .insert({
            content: questionContent,
            sub_topic_id: subTopicId,
            ai_generated: true,
            question_type: questionType,
            generation_prompt: selectedEvent.payload.prompt || null,
          });
          
        if (insertError) throw insertError;
      }
      
      const { error: updateError } = await supabase
        .from("webhook_events")
        .update({ 
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq("id", selectedEvent.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Success",
        description: `${editedQuestions.length} questions saved successfully`,
      });
      
      setSelectedEvent(null);
      setEditedQuestions([]);
      
      const { data: updatedEvents, error } = await supabase
        .from("webhook_events")
        .select("*")
        .eq("event_type", "question_generated")
        .eq("processed", false)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setWebhookEvents(updatedEvents || []);
      
    } catch (error) {
      console.error("Error saving questions:", error);
      toast({
        title: "Error",
        description: "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardEvent = async () => {
    if (!selectedEvent) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("webhook_events")
        .update({ 
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
      
      toast({
        title: "Event Discarded",
        description: "The webhook event has been marked as processed",
      });
      
      setSelectedEvent(null);
      setEditedQuestions([]);
      
      const { data: updatedEvents, error: fetchError } = await supabase
        .from("webhook_events")
        .select("*")
        .eq("event_type", "question_generated")
        .eq("processed", false)
        .order("created_at", { ascending: false });
        
      if (fetchError) throw fetchError;
      setWebhookEvents(updatedEvents || []);
      
    } catch (error) {
      console.error("Error discarding event:", error);
      toast({
        title: "Error",
        description: "Failed to discard event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    webhookEvents,
    isLoading,
    selectedEvent,
    editedQuestions,
    handleSelectEvent,
    handleUpdateQuestion,
    handleSaveQuestions,
    handleDiscardEvent,
  };
};
