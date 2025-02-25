
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MultipleChoiceOptionsProps {
  options: string[];
  correctAnswerIndex: number;
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (index: number) => void;
}

export const MultipleChoiceOptions = ({
  options,
  correctAnswerIndex,
  onOptionChange,
  onCorrectAnswerChange,
}: MultipleChoiceOptionsProps) => {
  return (
    <div className="space-y-4">
      <Label>Answer Options</Label>
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
        </div>
      ))}
    </div>
  );
};
