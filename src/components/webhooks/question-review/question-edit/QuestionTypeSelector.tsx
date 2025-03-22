
import { Button } from "@/components/ui/button";

interface QuestionTypeSelectorProps {
  hasMultipleChoice: boolean;
  onSelectTextAnswer: () => void;
  onSelectMultipleChoice: () => void;
}

export const QuestionTypeSelector = ({
  hasMultipleChoice,
  onSelectTextAnswer,
  onSelectMultipleChoice
}: QuestionTypeSelectorProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        type="button" 
        variant={!hasMultipleChoice ? "default" : "outline"}
        onClick={onSelectTextAnswer}
        className="flex-1"
      >
        Text Answer
      </Button>
      <Button 
        type="button" 
        variant={hasMultipleChoice ? "default" : "outline"}
        onClick={onSelectMultipleChoice}
        className="flex-1"
      >
        Multiple Choice
      </Button>
    </div>
  );
};
