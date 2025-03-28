
import { useState } from "react";
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useQuestionUpdates = (
  editedQuestions: QuestionItem[],
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuestion = async (index: number, updatedQuestion: QuestionItem) => {
    try {
      setIsUpdating(true);
      
      // Special case: index = -1 means append a new question
      if (index === -1) {
        setEditedQuestions([...editedQuestions, updatedQuestion]);
        toast({
          title: "Question added",
          description: "A new question has been added to the list"
        });
      } else {
        // Create a new array with the updated item
        const updatedQuestions = [...editedQuestions];
        updatedQuestions[index] = updatedQuestion;
        
        setEditedQuestions(updatedQuestions);
        
        toast({
          title: "Question updated",
          description: `Question #${index + 1} has been updated`
        });
      }
      
      setIsUpdating(false);
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error",
        description: `Failed to update question: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  return {
    handleUpdateQuestion,
    isUpdating
  };
};
