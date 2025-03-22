
import { useState } from "react";
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useQuestionUpdates = (
  editedQuestions: QuestionItem[], 
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuestion = (index: number, updatedQuestion: QuestionItem) => {
    try {
      // Validate index
      if (index < 0 || index >= editedQuestions.length) {
        throw new Error(`Invalid question index: ${index}`);
      }

      // Validate question has required fields
      if (!updatedQuestion.question.trim()) {
        throw new Error("Question text cannot be empty");
      }

      setIsUpdating(true);
      const updatedQuestions = [...editedQuestions];
      updatedQuestions[index] = updatedQuestion;
      setEditedQuestions(updatedQuestions);
      
      // Show success toast if everything worked
      toast({
        title: "Question updated",
        description: `Question #${index + 1} updated successfully`,
      });
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Error updating question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleUpdateQuestion,
    isUpdating
  };
};
