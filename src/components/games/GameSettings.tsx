
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Difficulty = "easy" | "medium" | "hard";

interface GameSettingsProps {
  difficulty: Difficulty;
  onDifficultyChange: (value: Difficulty) => void;
  showTimer?: boolean;
  onShowTimerChange?: (value: boolean) => void;
}

export const GameSettings = ({
  difficulty,
  onDifficultyChange,
}: GameSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select
          value={difficulty}
          onValueChange={(value) => onDifficultyChange(value as Difficulty)}
        >
          <SelectTrigger id="difficulty">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
