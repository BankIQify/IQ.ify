
import { Check, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnswerInputProps } from "./types";

/**
 * AnswerInput component handles the user input for answering questions
 * and displays feedback after submission.
 */
export const AnswerInput = ({
  userAnswer,
  setUserAnswer,
  handleAnswer,
  handleKeyPress,
  showFeedback,
  isCorrect,
  currentQuestion
}: AnswerInputProps) => {
  return (
    <div className="relative">
      {/* Answer input field and submit button */}
      <div className="flex gap-3">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your answer"
          className={cn(
            "text-lg font-medium text-center",
            showFeedback && (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50")
          )}
          autoFocus
        />
        <Button 
          onClick={handleAnswer}
          className={cn(
            "px-6",
            showFeedback && (isCorrect ? "bg-green-500" : "bg-red-500")
          )}
        >
          Submit
        </Button>
      </div>
      
      {/* Feedback display - shows after answer submission */}
      {showFeedback && (
        <div className={cn(
          "absolute top-full left-0 right-0 text-center mt-2 py-1 px-2 rounded font-medium",
          isCorrect ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
        )}>
          {isCorrect ? (
            <div className="flex items-center justify-center gap-1">
              <Check className="h-4 w-4" />
              <span>Correct!</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                <span>Incorrect! The answer is {currentQuestion?.answer}</span>
              </div>
              {currentQuestion?.explanation && (
                <p className="text-sm mt-1 max-w-md">
                  {currentQuestion.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
