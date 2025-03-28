
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface QuestionBasicFieldsProps {
  question: string;
  explanation: string;
  onQuestionChange: (value: string) => void;
  onExplanationChange: (value: string) => void;
  index?: number;
}

export const QuestionBasicFields = ({
  question,
  explanation,
  onQuestionChange,
  onExplanationChange,
  index = 0
}: QuestionBasicFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor={`question-${index}`}>Question</Label>
        <Textarea
          id={`question-${index}`}
          value={question || ""}
          onChange={(e) => onQuestionChange(e.target.value)}
          rows={2}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor={`explanation-${index}`}>Explanation</Label>
        <Textarea
          id={`explanation-${index}`}
          value={explanation || ""}
          onChange={(e) => onExplanationChange(e.target.value)}
          rows={3}
          className="mt-1"
        />
      </div>
    </>
  );
};
