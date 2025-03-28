
import { Brain, Timer, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { GameStatsHeaderProps } from "./types";

export const GameStatsHeader = ({
  currentQuestionIndex,
  totalQuestions,
  timer,
  score,
  questionType,
  progressPercentage,
}: GameStatsHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-pastel-purple/30 to-pastel-blue/30 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Time: {timer}s
          </span>
        </div>
      </div>
      
      <Progress value={progressPercentage} className="h-2 mb-2" />
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Type: <span className="capitalize">{questionType}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{score} points</span>
        </div>
      </div>
    </div>
  );
};
