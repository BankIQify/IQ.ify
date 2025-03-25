
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, Sparkles, Award } from "lucide-react";
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
    <Card className="overflow-hidden border-2 border-pastel-blue rounded-xl shadow-lg">
      <div className="p-6 bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 border-b-2 border-pastel-blue/30">
        <h3 className="text-xl font-bold text-iqify-navy">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="p-6">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-5"
        >
          {currentQuestion.options.map((option: string, index: number) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center space-x-2 p-4 rounded-xl border-2 transition-all duration-200",
                showExplanation && option === currentQuestion.correctAnswer ? "bg-green-50 border-green-400 shadow-md" : "",
                showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "bg-red-50 border-red-300" : "",
                !showExplanation && selectedAnswer === option ? "border-primary bg-primary/10" : "border-slate-200",
                !showExplanation && "hover:bg-gray-50 hover:border-pastel-purple/50 hover:shadow-md"
              )}
            >
              <RadioGroupItem
                value={option}
                id={`option-${index}`}
                disabled={showExplanation}
                className={cn(
                  "h-5 w-5",
                  showExplanation && option === currentQuestion.correctAnswer ? "border-green-500 text-green-500" : "",
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "border-red-500 text-red-500" : ""
                )}
              />
              <Label 
                htmlFor={`option-${index}`}
                className={cn(
                  "cursor-pointer w-full font-medium text-lg",
                  showExplanation && option === currentQuestion.correctAnswer ? "text-green-700" : "",
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "text-red-700" : ""
                )}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation ? (
          <div className="space-y-5 mt-8 animate-fadeIn">
            <div className="p-6 bg-pastel-blue/15 rounded-xl border-2 border-pastel-blue/30">
              <div className="flex items-start gap-3">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <Sparkles className="h-6 w-6 text-green-500 mt-0.5 animate-pulse" />
                ) : (
                  <Award className="h-6 w-6 text-amber-500 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-lg mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer 
                      ? "Great job! You got it right! 👍" 
                      : "Let's learn from this one! 🤔"}
                  </h4>
                  <p className="text-muted-foreground text-base">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={moveToNextQuestion}
              className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90 p-6 h-auto text-lg font-bold rounded-xl shadow-md"
            >
              {currentQuestionIndex < totalQuestions - 1 ? (
                <span className="flex items-center gap-2">
                  Next Question
                  <ChevronRight className="h-5 w-5" />
                </span>
              ) : (
                "Finish Test"
              )}
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAnswer}
            className="w-full mt-8 bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90 p-6 h-auto text-lg font-bold rounded-xl shadow-md"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
};
