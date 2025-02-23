
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Question } from "./types";

interface GameResultsProps {
  answeredQuestions: Question[];
  onReset: () => void;
}

export const GameResults = ({ answeredQuestions, onReset }: GameResultsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Game Over!</h3>
      <div className="space-y-2">
        <p>
          Score: {answeredQuestions.filter((q) => q.isCorrect).length} /{" "}
          {answeredQuestions.length}
        </p>
        <div className="space-y-2">
          <h4 className="font-semibold">Incorrect Answers:</h4>
          {answeredQuestions
            .filter((q) => !q.isCorrect)
            .map((q, i) => (
              <div key={i} className="flex items-center gap-2 text-destructive">
                <X className="h-4 w-4" />
                {q.operation === "multiply"
                  ? `${q.num1} × ${q.num2} = ${q.answer} (you answered: ${q.userAnswer})`
                  : `${q.num1} ÷ ${q.num2} = ${q.answer} (you answered: ${q.userAnswer})`}
              </div>
            ))}
        </div>
      </div>
      <Button onClick={onReset}>Try Again</Button>
    </div>
  );
};

