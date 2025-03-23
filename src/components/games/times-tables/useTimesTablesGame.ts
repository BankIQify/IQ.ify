
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { generateQuestion } from "./utils";
import type { Question } from "./types";

/**
 * Custom hook that manages the state and logic for the Times Tables game.
 * It handles:
 * - Game configuration (selected tables, time limit)
 * - Question generation and answer validation
 * - Game state (active, timer, progress)
 * - User interactions (answering questions, starting/resetting game)
 */
export const useTimesTablesGame = () => {
  // Game configuration state
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [timeLimit, setTimeLimit] = useState<number>(60);
  
  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Question[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  // Utilities and external hooks
  const { toast } = useToast();
  const { timer, isActive, startGame, resetGame } = useGameState({
    initialTimer: timeLimit,
    gameType: "times_tables",
  });

  /**
   * Handles the submission of an answer for the current question.
   * Validates the answer, updates the game state, and moves to the next question.
   */
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
        moveToNextQuestion(currentQuestion, numericAnswer, isAnswerCorrect);
      }, 3000); // Show explanation for 3 seconds
    } else {
      // For correct answers, immediately move to next question without showing extended feedback
      moveToNextQuestion(currentQuestion, numericAnswer, isAnswerCorrect);
      
      // Show brief feedback flash for correct answers
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 500);
    }
  };

  /**
   * Helper function to handle the transition to the next question
   * by updating the answered questions list and generating a new question.
   */
  const moveToNextQuestion = (
    question: Question, 
    userAnswerValue: number, 
    isAnswerCorrect: boolean
  ) => {
    setAnsweredQuestions((prev) => [...prev, {
      ...question,
      userAnswer: userAnswerValue,
      isCorrect: isAnswerCorrect,
    }]);
    setUserAnswer("");
    setCurrentQuestion(generateQuestion(selectedTables));
    setShowFeedback(false);
  };

  /**
   * Handles keyboard events for answer submission (Enter key).
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnswer();
    }
  };

  /**
   * Initiates the game if at least one times table is selected.
   * Resets game state and generates the first question.
   */
  const handleStartGame = () => {
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

  /**
   * Toggles the selection of a specific times table.
   * If already selected, it removes it; otherwise, adds it.
   */
  const toggleTimesTable = (table: number) => {
    setSelectedTables((prev) =>
      prev.includes(table)
        ? prev.filter((t) => t !== table)
        : [...prev, table].sort((a, b) => a - b)
    );
  };

  /**
   * Updates the time limit for the game.
   */
  const handleTimeLimitChange = (limit: number) => {
    setTimeLimit(limit);
  };

  // Clean up current question when timer reaches zero
  useEffect(() => {
    if (timer === 0) {
      setCurrentQuestion(null);
    }
  }, [timer]);

  // Calculate progress percentage for the progress bar
  const progressPercentage = (timer / timeLimit) * 100;

  return {
    // Game configuration
    selectedTables,
    timeLimit,
    
    // Game state
    currentQuestion,
    userAnswer,
    answeredQuestions,
    showFeedback,
    isCorrect,
    timer,
    isActive,
    progressPercentage,
    
    // Event handlers
    setUserAnswer,
    handleAnswer,
    handleKeyPress,
    handleStartGame,
    toggleTimesTable,
    handleTimeLimitChange,
    resetGame,
  };
};
