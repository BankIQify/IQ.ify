
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookEvent } from "./types";
import { useEventSelection } from "./hooks/useEventSelection";
import { useQuestionEditing } from "./hooks/useQuestionEditing";
import { 
  fetchWebhookEvents, 
  saveQuestion, 
  markEventAsProcessed 
} from "./api/webhookEventsApi";

export const useWebhookQuestions = () => {
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const { 
    selectedEvent, 
    editedQuestions, 
    handleSelectEvent, 
    setEditedQuestions,
    clearSelectedEvent 
  } = useEventSelection();
  
  const { handleUpdateQuestion } = useQuestionEditing(editedQuestions, setEditedQuestions);

  const loadWebhookEvents = async () => {
    setIsLoading(true);
    try {
      const events = await fetchWebhookEvents();
      setWebhookEvents(events);
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

  useEffect(() => {
    loadWebhookEvents();
    
    const interval = setInterval(loadWebhookEvents, 30000);
    return () => clearInterval(interval);
  }, [toast]);

  const handleSaveQuestions = async () => {
    if (!selectedEvent || !editedQuestions.length) return;
    
    setIsLoading(true);
    try {
      const subTopicId = selectedEvent.payload.sub_topic_id;
      
      if (!subTopicId) {
        throw new Error("No sub-topic ID provided in webhook payload");
      }
      
      // Save each question
      for (const question of editedQuestions) {
        await saveQuestion(
          question, 
          subTopicId, 
          selectedEvent.payload.prompt || null
        );
      }
      
      // Mark the event as processed
      await markEventAsProcessed(selectedEvent.id);
      
      toast({
        title: "Success",
        description: `${editedQuestions.length} questions saved successfully`,
      });
      
      clearSelectedEvent();
      await loadWebhookEvents();
      
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
      await markEventAsProcessed(selectedEvent.id);
      
      toast({
        title: "Event Discarded",
        description: "The webhook event has been marked as processed",
      });
      
      clearSelectedEvent();
      await loadWebhookEvents();
      
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
