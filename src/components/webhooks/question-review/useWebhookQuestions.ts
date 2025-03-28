
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookEvent, QuestionItem } from "./types";
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
    isProcessing: isProcessingEvent,
    error: eventSelectionError,
    handleSelectEvent, 
    setEditedQuestions,
    clearSelectedEvent,
    handleSetQuestions 
  } = useEventSelection();
  
  const { 
    handleUpdateQuestion,
    handleBulkUpdate,
    handleDeleteQuestion,
    isUpdating 
  } = useQuestionEditing(editedQuestions, setEditedQuestions);

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
    if (!selectedEvent || !editedQuestions.length) {
      toast({
        title: "Cannot save",
        description: "No questions to save or no event selected",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Try to get subTopicId either from the event payload or from individual questions
      const eventSubTopicId = selectedEvent.payload.sub_topic_id;
      
      for (const question of editedQuestions) {
        // Use question's subTopicId if available, otherwise fall back to event's subTopicId
        const subTopicId = question.subTopicId || eventSubTopicId;
        
        if (!subTopicId) {
          throw new Error("No sub-topic ID found for question: " + question.question.substring(0, 30) + "...");
        }
        
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
        description: error instanceof Error ? error.message : "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscardEvent = async () => {
    if (!selectedEvent) {
      toast({
        title: "No event selected",
        description: "There is no event to discard",
        variant: "destructive",
      });
      return;
    }
    
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
        description: error instanceof Error ? error.message : "Failed to discard event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Combine all loading states
  const isBusy = isLoading || isProcessingEvent || isUpdating;

  return {
    webhookEvents,
    isLoading: isBusy,
    selectedEvent,
    editedQuestions,
    error: eventSelectionError,
    handleSelectEvent,
    handleUpdateQuestion,
    handleDeleteQuestion,
    handleSaveQuestions,
    handleDiscardEvent,
    handleSetQuestions,
  };
};
