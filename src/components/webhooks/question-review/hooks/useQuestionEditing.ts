
import { QuestionItem } from "../types";
import { useQuestionUpdates } from "./useQuestionUpdates";
import { useBulkQuestionOperations } from "./useBulkQuestionOperations";
import { useQuestionDeletion } from "./useQuestionDeletion";

export const useQuestionEditing = (
  editedQuestions: QuestionItem[], 
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const { handleUpdateQuestion, isUpdating } = useQuestionUpdates(
    editedQuestions, 
    setEditedQuestions
  );
  
  const { handleBulkUpdate } = useBulkQuestionOperations(
    setEditedQuestions
  );
  
  const { handleDeleteQuestion } = useQuestionDeletion(
    editedQuestions, 
    setEditedQuestions
  );

  return {
    handleUpdateQuestion,
    handleBulkUpdate,
    handleDeleteQuestion,
    isUpdating
  };
};
