
import { useState } from "react";
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useQuestionEditing = (
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

  const handleBulkUpdate = (updatedQuestions: QuestionItem[]) => {
    try {
      if (!Array.isArray(updatedQuestions)) {
        throw new Error("Invalid questions data");
      }
      
      setEditedQuestions(updatedQuestions);
      toast({
        title: "Questions updated",
        description: `${updatedQuestions.length} questions updated successfully`,
      });
    } catch (error) {
      console.error("Error updating questions:", error);
      toast({
        title: "Error updating questions",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = (index: number) => {
    try {
      if (index < 0 || index >= editedQuestions.length) {
        throw new Error(`Invalid question index: ${index}`);
      }

      const updatedQuestions = [...editedQuestions];
      updatedQuestions.splice(index, 1);
      setEditedQuestions(updatedQuestions);
      
      toast({
        title: "Question removed",
        description: `Question #${index + 1} has been removed`,
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error removing question",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpdateQuestion,
    handleBulkUpdate,
    handleDeleteQuestion,
    isUpdating
  };
};
