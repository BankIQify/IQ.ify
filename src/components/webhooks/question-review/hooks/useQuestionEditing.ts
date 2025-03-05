
import { QuestionItem } from "../types";

export const useQuestionEditing = (
  editedQuestions: QuestionItem[], 
  setEditedQuestions: (questions: QuestionItem[]) => void
) => {
  const handleUpdateQuestion = (index: number, updatedQuestion: QuestionItem) => {
    const updatedQuestions = [...editedQuestions];
    updatedQuestions[index] = updatedQuestion;
    setEditedQuestions(updatedQuestions);
  };

  return {
    handleUpdateQuestion
  };
};
