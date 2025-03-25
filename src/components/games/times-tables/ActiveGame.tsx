
import { Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { AnswerInput } from "./AnswerInput";
import type { ActiveGameProps } from "./types";

/**
 * ActiveGame component displays the current question and answer input
 * during an active times tables game session.
 */
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
    <div className="p-8 rounded-xl bg-white shadow-lg border-2 border-pastel-blue space-y-8 animate-fadeIn">
      {/* Timer and progress display */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-pastel-purple/20 px-3 py-1.5 rounded-full">
          <Timer className="h-5 w-5 text-primary animate-pulse" />
          <span className="font-bold">{timer}s</span>
        </div>
        <Progress value={progressPercentage} className="flex-1 h-3 rounded-full bg-gray-100" />
      </div>
      
      {/* Question display */}
      <div className="text-center py-10 px-6 rounded-xl bg-gradient-to-r from-pastel-blue/15 to-pastel-purple/15 border-2 border-pastel-blue/30 shadow-sm">
        <div className="text-4xl font-bold mb-3 text-iqify-navy">
          {currentQuestion.operation === "multiply"
            ? `${currentQuestion.num1} × ${currentQuestion.num2} = ?`
            : `${currentQuestion.num1} ÷ ${currentQuestion.num2} = ?`}
        </div>
        <p className="text-muted-foreground text-lg">
          {currentQuestion.operation === "multiply" 
            ? "Calculate the product" 
            : "Calculate the quotient"}
        </p>
      </div>
      
      {/* Answer input component */}
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
