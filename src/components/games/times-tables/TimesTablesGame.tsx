
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { generateQuestion } from "./utils";
import { GameControls } from "./GameControls";
import { ActiveGame } from "./ActiveGame";
import { GameResults } from "./GameResults";
import type { Question } from "./types";

const TimesTablesGame = () => {
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
    
    // Only show feedback if answer is incorrect
    if (!isAnswerCorrect) {
      setShowFeedback(true);
      
      // For incorrect answers, set a timer to move to the next question after showing explanation
      setTimeout(() => {
        setAnsweredQuestions((prev) => [...prev, {
          ...currentQuestion,
          userAnswer: numericAnswer,
          isCorrect: isAnswerCorrect,
        }]);
        setUserAnswer("");
        setCurrentQuestion(generateQuestion(selectedTables));
        setShowFeedback(false);
      }, 3000); // Show explanation for 3 seconds
    } else {
      // For correct answers, immediately move to next question without showing explanation
      setAnsweredQuestions((prev) => [...prev, {
        ...currentQuestion,
        userAnswer: numericAnswer,
        isCorrect: isAnswerCorrect,
      }]);
      setUserAnswer("");
      setCurrentQuestion(generateQuestion(selectedTables));
      
      // Show a brief flash of feedback for correct answers
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 500);
    }
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
        <GameControls
          selectedTables={selectedTables}
          timeLimit={timeLimit}
          onToggleTable={toggleTable}
          onTimeLimitChange={setTimeLimit}
          onStart={handleStart}
        />
      )}

      {isActive && currentQuestion && (
        <ActiveGame
          timer={timer}
          currentQuestion={currentQuestion}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          handleAnswer={handleAnswer}
          handleKeyPress={handleKeyPress}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          progressPercentage={progressPercentage}
        />
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

export default TimesTablesGame;
