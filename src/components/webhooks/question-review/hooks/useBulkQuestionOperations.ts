
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useBulkQuestionOperations = (
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const { toast } = useToast();

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

  return {
    handleBulkUpdate
  };
};
