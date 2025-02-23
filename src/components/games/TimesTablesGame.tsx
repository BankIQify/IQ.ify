
import { useState, useEffect } from "react";
import { Check, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { Label } from "@/components/ui/label";

type Question = {
  num1: number;
  num2: number;
  operation: "multiply" | "divide";
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
};

export const TimesTablesGame = () => {
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(60); // 1 minute default
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const { toast } = useToast();
  const { timer, isActive, startGame, resetGame } = useGameState({
    initialTimer: timeLimit,
    gameType: "sudoku", // Temporarily using sudoku as the game type since it's supported
  });

  const generateQuestion = (): Question | null => {
    if (selectedTables.length === 0) return null;

    const tableIndex = Math.floor(Math.random() * selectedTables.length);
    const num1 = selectedTables[tableIndex];
    const num2 = Math.floor(Math.random() * 25) + 1;
    const operation: "multiply" | "divide" = Math.random() < 0.5 ? "multiply" : "divide";

    if (operation === "multiply") {
      return {
        num1,
        num2,
        operation,
        answer: num1 * num2,
      };
    } else {
      return {
        num1: num1 * num2, // The dividend
        num2: num1, // The divisor
        operation,
        answer: num2, // The quotient
      };
    }
  };

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
    setCurrentQuestion(generateQuestion());
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
    setCurrentQuestion(generateQuestion());
    startGame();
  };

  useEffect(() => {
    if (timer === 0) {
      setCurrentQuestion(null);
    }
  }, [timer]);

  const toggleTable = (table: number) => {
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table].sort((a, b) => a - b)
    );
  };

  return (
    <div className="space-y-6">
      {!isActive && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 25 }, (_, i) => i + 1).map((table) => (
              <div key={table} className="flex items-center space-x-2">
                <Checkbox
                  id={`table-${table}`}
                  checked={selectedTables.includes(table)}
                  onCheckedChange={() => toggleTable(table)}
                />
                <Label htmlFor={`table-${table}`}>{table}×</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Time Limit</Label>
            <div className="flex gap-2">
              <Button
                variant={timeLimit === 60 ? "default" : "outline"}
                onClick={() => setTimeLimit(60)}
              >
                1 Minute
              </Button>
              <Button
                variant={timeLimit === 120 ? "default" : "outline"}
                onClick={() => setTimeLimit(120)}
              >
                2 Minutes
              </Button>
              <Button
                variant={timeLimit === 180 ? "default" : "outline"}
                onClick={() => setTimeLimit(180)}
              >
                3 Minutes
              </Button>
            </div>
          </div>
          <Button onClick={handleStart}>Start Game</Button>
        </div>
      )}

      {isActive && currentQuestion && (
        <div className="space-y-4">
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
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Game Over!</h3>
          <div className="space-y-2">
            <p>
              Score: {answeredQuestions.filter((q) => q.isCorrect).length} /{" "}
              {answeredQuestions.length}
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Incorrect Answers:</h4>
              {answeredQuestions
                .filter((q) => !q.isCorrect)
                .map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <X className="h-4 w-4" />
                    {q.operation === "multiply"
                      ? `${q.num1} × ${q.num2} = ${q.answer} (you answered: ${q.userAnswer})`
                      : `${q.num1} ÷ ${q.num2} = ${q.answer} (you answered: ${q.userAnswer})`}
                  </div>
                ))}
            </div>
          </div>
          <Button onClick={resetGame}>Try Again</Button>
        </div>
      )}
    </div>
  );
};

