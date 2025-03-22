
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { OptionInput } from "./OptionInput";

interface MultipleChoiceEditorProps {
  options: string[];
  correctAnswer?: string;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export const MultipleChoiceEditor = ({
  options,
  correctAnswer,
  onOptionChange,
  onCorrectAnswerChange,
  onAddOption,
  onRemoveOption
}: MultipleChoiceEditorProps) => {
  if (!Array.isArray(options)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label>Options</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onAddOption}
          className="h-8"
        >
          <PlusCircle className="h-4 w-4 mr-1" /> Add Option
        </Button>
      </div>
      {options.map((option, i) => (
        <OptionInput
          key={i}
          option={option}
          isCorrect={option === correctAnswer}
          onOptionChange={(value) => onOptionChange(i, value)}
          onSetCorrect={() => onCorrectAnswerChange(option)}
          onRemove={() => onRemoveOption(i)}
          showRemoveButton={options.length > 1}
        />
      ))}
    </div>
  );
};
