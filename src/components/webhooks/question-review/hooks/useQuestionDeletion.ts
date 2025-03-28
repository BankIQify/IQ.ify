
import { useState } from "react";
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useQuestionDeletion = (
  editedQuestions: QuestionItem[],
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDeleteQuestion = async (index: number) => {
    try {
      setIsDeleting(true);
      
      // Create a new array without the item at the specified index
      const updatedQuestions = [
        ...editedQuestions.slice(0, index),
        ...editedQuestions.slice(index + 1)
      ];
      
      setEditedQuestions(updatedQuestions);
      
      toast({
        title: "Question deleted",
        description: `Question #${index + 1} has been removed`
      });
      
      setIsDeleting(false);
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: `Failed to delete question: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  return {
    handleDeleteQuestion,
    isDeleting
  };
};
