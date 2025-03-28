
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface TimeLimitSelectorProps {
  timeLimit: number;
  onTimeLimitChange: (limit: number) => void;
}

/**
 * TimeLimitSelector component provides options for selecting the
 * game duration (1, 2, or 3 minutes).
 */
export const TimeLimitSelector = ({
  timeLimit,
  onTimeLimitChange,
}: TimeLimitSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Time Limit</Label>
      <div className="flex gap-2">
        <Button
          variant={timeLimit === 60 ? "default" : "outline"}
          onClick={() => onTimeLimitChange(60)}
        >
          1 Minute
        </Button>
        <Button
          variant={timeLimit === 120 ? "default" : "outline"}
          onClick={() => onTimeLimitChange(120)}
        >
          2 Minutes
        </Button>
        <Button
          variant={timeLimit === 180 ? "default" : "outline"}
          onClick={() => onTimeLimitChange(180)}
        >
          3 Minutes
        </Button>
      </div>
    </div>
  );
};
