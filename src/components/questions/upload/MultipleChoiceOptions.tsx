
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle } from "lucide-react";

interface MultipleChoiceOptionsProps {
  options: string[];
  correctAnswerIndex: number;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (index: number) => void;
  onAddOption?: () => void;
  onRemoveOption?: (index: number) => void;
}

export const MultipleChoiceOptions = ({
  options,
  correctAnswerIndex,
  onOptionChange,
  onCorrectAnswerChange,
  onAddOption,
  onRemoveOption,
}: MultipleChoiceOptionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Answer Options</Label>
        {options.length < 6 && onAddOption && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onAddOption}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add Option
          </Button>
        )}
      </div>
      
      {options.map((option, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className={correctAnswerIndex === index ? "border-green-500 border-2" : ""}
          />
          <input
            type="radio"
            name="correctAnswer"
            checked={correctAnswerIndex === index}
            onChange={() => onCorrectAnswerChange(index)}
            className="mt-3"
          />
          {options.length > 2 && onRemoveOption && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveOption(index)}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
