
import { useState, useEffect } from "react";
import { Timer, Brain, Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { Progress } from "@/components/ui/progress";
import { TableSelector } from "./times-tables/TableSelector";
import { TimeLimitSelector } from "./times-tables/TimeLimitSelector";
import { GameResults } from "./times-tables/GameResults";
import { generateQuestion } from "./times-tables/utils";
import type { Question } from "./times-tables/types";
import { cn } from "@/lib/utils";

export const TimesTablesGame = () => {
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const { toast } = useToast();
  const { timer, isActive, startGame, resetGame } = useGameState({
    initialTimer: timeLimit,
    gameType: "times_tables",
  });

  const handleAnswer = () => {
    if (!currentQuestion || !userAnswer) return;

    const numericAnswer = parseInt(userAnswer);
    const isAnswerCorrect = numericAnswer === currentQuestion.answer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const answeredQuestion = {
      ...currentQuestion,
      userAnswer: numericAnswer,
      isCorrect: isAnswerCorrect,
    };

    setTimeout(() => {
      setAnsweredQuestions((prev) => [...prev, answeredQuestion]);
      setUserAnswer("");
      setCurrentQuestion(generateQuestion(selectedTables));
      setShowFeedback(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnswer();
    }
  };

  const handleStart = () => {
    if (selectedTables.length === 0) {
      toast({
        title: "Select Times Tables",
        description: "Please select at least one times table to begin.",
        variant: "destructive",
      });
      return;
    }
    setAnsweredQuestions([]);
    setCurrentQuestion(generateQuestion(selectedTables));
    startGame();
  };

  const toggleTable = (table: number) => {
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table].sort((a, b) => a - b)
    );
  };

  useEffect(() => {
    if (timer === 0) {
      setCurrentQuestion(null);
    }
  }, [timer]);

  const progressPercentage = (timer / timeLimit) * 100;

  return (
    <div className="space-y-6">
      {!isActive && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-pastel-blue/20 to-pastel-purple/20 shadow-sm space-y-6">
          <div className="text-center mb-6">
            <Brain className="w-12 h-12 text-primary mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Times Tables Challenge</h2>
            <p className="text-muted-foreground">Test your multiplication and division skills</p>
          </div>
          
          <TableSelector
            selectedTables={selectedTables}
            onToggleTable={toggleTable}
          />
          
          <TimeLimitSelector
            timeLimit={timeLimit}
            onTimeLimitChange={setTimeLimit}
          />
          
          <Button 
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90 text-white transition-all"
            size="lg"
          >
            Start Challenge
          </Button>
        </div>
      )}

      {isActive && currentQuestion && (
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
          
          <div className="relative">
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
                  <div className="flex items-center justify-center gap-1">
                    <XCircle className="h-4 w-4" />
                    <span>Incorrect! The answer is {currentQuestion.answer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {timer === 0 && (
        <div className="animate-fade-in">
          <GameResults
            answeredQuestions={answeredQuestions}
            onReset={resetGame}
          />
        </div>
      )}
    </div>
  );
};
