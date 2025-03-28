
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionConfigProps {
  questionCount: number;
  setQuestionCount: (count: number) => void;
  timeLimit: number | undefined;
  setTimeLimit: (limit: number | undefined) => void;
}

export function QuestionConfig({
  questionCount,
  setQuestionCount,
  timeLimit,
  setTimeLimit
}: QuestionConfigProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="questionCount">Number of Questions (10-40)</Label>
        <Input
          id="questionCount"
          type="number"
          min="10"
          max="40"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
        <Input
          id="timeLimit"
          type="number"
          min="1"
          max="120"
          value={timeLimit || ""}
          onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Enter time limit (1-120 minutes)"
        />
      </div>
    </>
  );
}
