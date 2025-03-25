
import { Check, XCircle, Sparkles } from "lucide-react";
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
      <div className="flex gap-4">
        <Input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your answer"
          className={cn(
            "text-xl font-medium text-center h-14 rounded-xl border-2",
            showFeedback && (isCorrect 
              ? "border-green-500 bg-green-50 focus-visible:ring-green-300" 
              : "border-red-500 bg-red-50 focus-visible:ring-red-300")
          )}
          autoFocus
        />
        <Button 
          onClick={handleAnswer}
          className={cn(
            "px-8 h-14 rounded-xl text-lg font-bold",
            showFeedback && (isCorrect 
              ? "bg-green-500 hover:bg-green-600" 
              : "bg-red-500 hover:bg-red-600"),
            !showFeedback && "bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
          )}
        >
          Submit
        </Button>
      </div>
      
      {/* Feedback display - shows after answer submission */}
      {showFeedback && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-4 py-4 px-5 rounded-xl font-medium border-2 shadow-md animate-fadeIn",
          isCorrect 
            ? "text-green-700 bg-green-50 border-green-300" 
            : "text-red-700 bg-red-50 border-red-300"
        )}>
          {isCorrect ? (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500 animate-pulse" />
              <span className="text-lg">Fantastic! That's correct!</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-lg">Not quite right! The answer is {currentQuestion?.answer}</span>
              </div>
              {currentQuestion?.explanation && (
                <p className="text-base mt-2 bg-white p-3 rounded-lg">
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
