
import { Card } from "@/components/ui/card";
import { EditableQuestionsList } from "@/components/questions/editable-questions";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";

interface QuestionBankResultsProps {
  questions: QuestionWithDuplicateFlag[];
  isLoading: boolean;
}

export const QuestionBankResults = ({ questions, isLoading }: QuestionBankResultsProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-center">Loading questions...</p>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-center">No questions match your current filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <EditableQuestionsList questions={questions} />
    </div>
  );
};
