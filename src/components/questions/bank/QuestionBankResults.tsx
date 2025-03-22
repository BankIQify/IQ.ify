
import { QuestionsList } from "../QuestionsList";
import type { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";

interface QuestionBankResultsProps {
  questions: QuestionWithDuplicateFlag[];
  isLoading: boolean;
}

export const QuestionBankResults = ({ questions, isLoading }: QuestionBankResultsProps) => {
  if (isLoading) {
    return <p className="text-gray-600">Loading questions...</p>;
  }
  
  if (questions.length === 0) {
    return <p className="text-gray-600">No questions found.</p>;
  }
  
  return <QuestionsList questions={questions} />;
};
