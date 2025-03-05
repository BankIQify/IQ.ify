
import { useState } from "react";
import { WebhookEvent, QuestionItem } from "../types";

export const useEventSelection = () => {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [editedQuestions, setEditedQuestions] = useState<QuestionItem[]>([]);

  const handleSelectEvent = (event: WebhookEvent) => {
    setSelectedEvent(event);
    if (event.payload && event.payload.questions) {
      setEditedQuestions(event.payload.questions);
    }
  };

  const clearSelectedEvent = () => {
    setSelectedEvent(null);
    setEditedQuestions([]);
  };

  return {
    selectedEvent,
    editedQuestions,
    handleSelectEvent,
    setEditedQuestions,
    clearSelectedEvent
  };
};
