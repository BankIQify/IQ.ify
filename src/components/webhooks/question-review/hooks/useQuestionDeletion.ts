
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useQuestionDeletion = (
  editedQuestions: QuestionItem[], 
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const { toast } = useToast();

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
    handleDeleteQuestion
  };
};
