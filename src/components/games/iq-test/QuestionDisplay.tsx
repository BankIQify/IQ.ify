
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuestionDisplayProps } from "./types";

export const QuestionDisplay = ({
  currentQuestion,
  selectedAnswer,
  setSelectedAnswer,
  showExplanation,
  handleAnswer,
  moveToNextQuestion,
  currentQuestionIndex,
  totalQuestions,
}: QuestionDisplayProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-pastel-blue/5 to-pastel-purple/5 border-b">
        <h3 className="text-lg font-semibold">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="p-6">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-4"
        >
          {currentQuestion.options.map((option: string, index: number) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center space-x-2 p-3 rounded-lg transition-colors",
                showExplanation && option === currentQuestion.correctAnswer ? "bg-green-50" : "",
                showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "bg-red-50" : "",
                !showExplanation && "hover:bg-gray-50"
              )}
            >
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                disabled={showExplanation}
                className={cn(
                  showExplanation && option === currentQuestion.correctAnswer ? "border-green-500 text-green-500" : "",
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "border-red-500 text-red-500" : ""
                )}
              />
              <Label 
                htmlFor={`option-${index}`}
                className={cn(
                  "cursor-pointer w-full",
                  showExplanation && option === currentQuestion.correctAnswer ? "text-green-700 font-medium" : "",
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "text-red-700" : ""
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation ? (
          <div className="space-y-4 mt-6 animate-fade-in">
            <div className="p-4 bg-pastel-blue/10 rounded-lg border border-pastel-blue/30">
              <h4 className="font-semibold mb-1">Explanation:</h4>
              <p className="text-muted-foreground">
                {currentQuestion.explanation}
              </p>
            </div>
            <Button
              onClick={moveToNextQuestion}
              className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
            >
              {currentQuestionIndex < totalQuestions - 1 ? (
                <span className="flex items-center gap-1">
                  Next Question
                  <ChevronRight className="h-4 w-4" />
                </span>
              ) : (
                "Finish Test"
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAnswer}
            className="w-full mt-6 bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
};
