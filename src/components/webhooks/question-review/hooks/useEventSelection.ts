
import { useState, useCallback } from "react";
import { WebhookEvent, QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";
import { parseRawQuestions } from "../utils/questionParser";

export const useEventSelection = () => {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<QuestionItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectEvent = useCallback((event: WebhookEvent) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Validate event
      if (!event || !event.payload) {
        throw new Error("Invalid webhook event data");
      }
      
      setSelectedEvent(event);
      
      // Handle questions in the payload
      if (event.payload.questions && Array.isArray(event.payload.questions)) {
        // If questions are already in the payload, use them
        setEditedQuestions(event.payload.questions);
      } else if (event.payload.raw_text) {
        // If raw text is available but no questions, try to parse them
        try {
          const parsedQuestions = parseRawQuestions(event.payload.raw_text);
          
          // Add subTopicId to parsed questions if available in payload
          if (event.payload.sub_topic_id) {
            parsedQuestions.forEach(q => {
              if (!q.subTopicId) {
                q.subTopicId = event.payload.sub_topic_id;
              }
            });
          }
          
          setEditedQuestions(parsedQuestions);
          
          if (parsedQuestions.length === 0) {
            toast({
              title: "Warning",
              description: "No questions could be parsed from the raw text",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Questions parsed",
              description: `${parsedQuestions.length} questions parsed from raw text`,
            });
          }
        } catch (parseError) {
          console.error("Error parsing raw text:", parseError);
          setEditedQuestions([]);
          toast({
            title: "Parsing error",
            description: "Failed to parse questions from raw text",
            variant: "destructive",
          });
        }
      } else {
        // No questions or raw text
        setEditedQuestions([]);
        toast({
          title: "No questions",
          description: "This webhook event doesn't contain any questions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error selecting event:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Error selecting event",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
    setEditedQuestions([]);
    setError(null);
  }, []);

  const handleSetQuestions = useCallback((questions: QuestionItem[]) => {
    try {
      if (!Array.isArray(questions)) {
        throw new Error("Invalid questions format");
      }
      
      setEditedQuestions(questions);
      
      if (questions.length > 0) {
        toast({
          title: "Questions updated",
          description: `Set ${questions.length} questions successfully`,
        });
      }
    } catch (error) {
      console.error("Error setting questions:", error);
      toast({
        title: "Error setting questions",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    selectedEvent,
    editedQuestions,
    isProcessing,
    error,
    handleSelectEvent,
    setEditedQuestions,
    clearSelectedEvent,
    handleSetQuestions
  };
};
