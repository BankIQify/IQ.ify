
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle } from "lucide-react";

interface OptionInputProps {
  option: string;
  isCorrect: boolean;
  onOptionChange: (value: string) => void;
  onSetCorrect: () => void;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export const OptionInput = ({
  option,
  isCorrect,
  onOptionChange,
  onSetCorrect,
  onRemove,
  showRemoveButton = true
}: OptionInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        value={option}
        onChange={(e) => onOptionChange(e.target.value)}
        className={isCorrect ? "border-green-500" : ""}
      />
      <Button
        type="button"
        variant={isCorrect ? "default" : "outline"}
        onClick={onSetCorrect}
        className="whitespace-nowrap"
      >
        {isCorrect ? "Correct ✓" : "Set as Correct"}
      </Button>
      {showRemoveButton && onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
