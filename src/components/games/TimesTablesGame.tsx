
import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
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

export const TimesTablesGame = () => {
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  const { timer, isActive, startGame, resetGame } = useGameState({
    initialTimer: timeLimit,
    gameType: "sudoku",
  });

  const handleAnswer = () => {
    if (!currentQuestion || !userAnswer) return;

    const numericAnswer = parseInt(userAnswer);
    const isCorrect = numericAnswer === currentQuestion.answer;

    const answeredQuestion = {
      ...currentQuestion,
      userAnswer: numericAnswer,
      isCorrect,
    };

    setAnsweredQuestions((prev) => [...prev, answeredQuestion]);
    setUserAnswer("");
    setCurrentQuestion(generateQuestion(selectedTables));
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
        <div className="space-y-4">
          <TableSelector
            selectedTables={selectedTables}
            onToggleTable={toggleTable}
          />
          <TimeLimitSelector
            timeLimit={timeLimit}
            onTimeLimitChange={setTimeLimit}
          />
          <Button onClick={handleStart}>Start Game</Button>
        </div>
      )}

      {isActive && currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="h-4 w-4" />
            <span>{timer}s</span>
            <Progress value={progressPercentage} className="flex-1" />
          </div>
          <div className="text-2xl font-bold text-center">
            {currentQuestion.operation === "multiply"
              ? `${currentQuestion.num1} × ${currentQuestion.num2} = ?`
              : `${currentQuestion.num1} ÷ ${currentQuestion.num2} = ?`}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer"
              className="text-lg"
              autoFocus
            />
            <Button onClick={handleAnswer}>Submit</Button>
          </div>
        </div>
      )}

      {timer === 0 && (
        <GameResults
          answeredQuestions={answeredQuestions}
          onReset={resetGame}
        />
      )}
    </div>
  );
};

