
import { Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AnswerInput } from "./AnswerInput";
import type { ActiveGameProps } from "./types";

export const ActiveGame = ({
  timer,
  currentQuestion,
  userAnswer,
  setUserAnswer,
  handleAnswer,
  handleKeyPress,
  showFeedback,
  isCorrect,
  progressPercentage
}: ActiveGameProps) => {
  if (!currentQuestion) return null;

  return (
    <div className="p-6 rounded-xl bg-white shadow-md space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Timer className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-bold">{timer}s remaining</span>
        <Progress value={progressPercentage} className="flex-1 h-2" />
      </div>
      
      <div className="text-center py-8 px-4 rounded-lg bg-gradient-to-r from-pastel-blue/10 to-pastel-purple/10">
        <div className="text-3xl font-bold mb-2">
          {currentQuestion.operation === "multiply"
            ? `${currentQuestion.num1} × ${currentQuestion.num2} = ?`
            : `${currentQuestion.num1} ÷ ${currentQuestion.num2} = ?`}
        </div>
        <p className="text-muted-foreground text-sm">
          {currentQuestion.operation === "multiply" 
            ? "Calculate the product" 
            : "Calculate the quotient"}
        </p>
      </div>
      
      <AnswerInput
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleAnswer={handleAnswer}
        handleKeyPress={handleKeyPress}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        currentQuestion={currentQuestion}
      />
    </div>
  );
};
