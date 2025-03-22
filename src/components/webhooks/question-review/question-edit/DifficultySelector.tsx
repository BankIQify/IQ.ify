
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DifficultySelectorProps {
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  index?: number;
}

export const DifficultySelector = ({
  difficulty,
  onDifficultyChange,
  index = 0
}: DifficultySelectorProps) => {
  return (
    <div>
      <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
      <Select
        value={difficulty || "medium"}
        onValueChange={onDifficultyChange}
      >
        <SelectTrigger id={`difficulty-${index}`}>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
          <SelectItem value="expert">Expert</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
