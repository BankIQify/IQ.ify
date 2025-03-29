import type { Difficulty } from "./GameSettings";
import { DIFFICULTY_LABELS } from "./GameSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector = ({
  difficulty,
  onDifficultyChange,
}: DifficultySelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">
        Difficulty
      </label>
      <Select
        value={difficulty}
        onValueChange={(value) => onDifficultyChange(value as Difficulty)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 