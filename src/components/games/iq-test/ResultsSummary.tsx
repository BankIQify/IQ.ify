
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResultsSummaryProps } from "./types";

export const ResultsSummary = ({
  score,
  answeredQuestions,
  totalQuestions,
  questionTypes,
  onReset,
}: ResultsSummaryProps) => {
  const accuracy = Math.round((score / (answeredQuestions.length * 10)) * 100) || 0;

  return (
    <div className="bg-gradient-to-r from-pastel-green to-pastel-blue p-6 rounded-xl shadow-md text-white animate-scale-in">
      <div className="flex gap-4 items-center">
        <Trophy className="h-12 w-12 text-yellow-300" />
        <div>
          <h3 className="text-2xl font-bold">Test Complete!</h3>
          <p className="opacity-90">
            You scored {score} points with a {accuracy}% accuracy.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        {Object.entries(questionTypes).map(([type, count]) => (
          <div key={type} className="bg-white/20 p-3 rounded-lg">
            <h4 className="text-sm uppercase opacity-80">{type}</h4>
            <p className="text-lg font-medium">{count} questions</p>
          </div>
        ))}
      </div>
      
      <Button
        onClick={onReset}
        className="w-full mt-6 bg-white text-primary hover:bg-white/90"
      >
        Start New Test
      </Button>
    </div>
  );
};
