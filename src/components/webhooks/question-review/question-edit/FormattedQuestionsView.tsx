
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuestionEditCard } from "../QuestionEditCard";
import { QuestionItem } from "../types";

interface FormattedQuestionsViewProps {
  questions: QuestionItem[];
  category: string;
  selectedSubTopicId?: string;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionItem) => void;
  isLoading: boolean;
}

export const FormattedQuestionsView = ({
  questions,
  category,
  selectedSubTopicId,
  onUpdateQuestion,
  isLoading
}: FormattedQuestionsViewProps) => {
  if (questions.length === 0 && !isLoading) {
    return (
      <Alert>
        <AlertDescription>
          No questions found. Try using the "Edit Raw Text" button to paste and parse question content.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => (
        <QuestionEditCard 
          key={index}
          question={question}
          index={index}
          category={category}
          selectedSubTopicId={selectedSubTopicId}
          onUpdateQuestion={(updatedQuestion) => onUpdateQuestion(index, updatedQuestion)}
        />
      ))}
    </div>
  );
};
