
import { EditableQuestionsList } from "../EditableQuestionsList";
import type { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";

interface QuestionBankResultsProps {
  questions: QuestionWithDuplicateFlag[];
  isLoading: boolean;
  onQuestionDeleted?: () => void;
}

export const QuestionBankResults = ({ questions, isLoading, onQuestionDeleted }: QuestionBankResultsProps) => {
  if (isLoading) {
    return <p className="text-gray-600">Loading questions...</p>;
  }
  
  if (questions.length === 0) {
    return <p className="text-gray-600">No questions found.</p>;
  }
  
  return <EditableQuestionsList questions={questions} onQuestionDeleted={onQuestionDeleted} />;
};
