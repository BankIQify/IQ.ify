
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import { QUESTIONS } from "@/data/iq-test-questions";
import type { Difficulty } from "@/components/games/GameSettings";
import type { Question } from "@/types/iq-test";

export const useIQGame = (difficulty: Difficulty) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [questionTypes, setQuestionTypes] = useState<Record<string, number>>({});
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const { toast } = useToast();

  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
    onGameOver: () => {
      handleGameOver();
    },
  });

  useEffect(() => {
    // Get questions for the current difficulty
    const questionsForDifficulty = QUESTIONS.filter(q => q.difficulty === difficulty);
    
    // Randomly select 15 questions
    const shuffled = [...questionsForDifficulty].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15);
    
    // If we don't have enough questions for the difficulty, pad with random questions from other difficulties
    if (selected.length < 15) {
      const remainingQuestions = QUESTIONS
        .filter(q => q.difficulty !== difficulty)
        .sort(() => Math.random() - 0.5)
        .slice(0, 15 - selected.length);
      
      selected.push(...remainingQuestions);
    }
    
    // Count question types for the statistics
    const types: Record<string, number> = {};
    selected.forEach(q => {
      if (!types[q.type]) types[q.type] = 0;
      types[q.type]++;
    });
    
    setQuestionTypes(types);
    setGameQuestions(selected);
    
    // Reset game state when difficulty changes
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setAnsweredQuestions([]);
    gameState.startGame();
  }, [difficulty]);

  const handleAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must choose an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = gameQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      gameState.updateScore(10);
      toast({
        title: "Correct!",
        description: "Moving to next question...",
      });
      
      // For correct answers, move to next question without showing explanation
      moveToNextQuestion();
    } else {
      // Only show explanation for incorrect answers
      toast({
        title: "Incorrect",
        description: "Let's see why before moving on.",
        variant: "destructive",
      });
      setShowExplanation(true);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    const totalQuestions = gameQuestions.length;
    const answeredCount = answeredQuestions.length;
    const accuracy = Math.round((gameState.score / (answeredCount * 10)) * 100) || 0;

    toast({
      title: "Test Complete!",
      description: `You scored ${gameState.score} points with ${accuracy}% accuracy. Keep practicing to improve your IQ!`,
    });
    
    gameState.resetGame();
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / gameQuestions.length) * 100;

  return {
    gameState,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    showExplanation,
    answeredQuestions,
    questionTypes,
    handleAnswer,
    moveToNextQuestion,
    progressPercentage,
    gameQuestions,
  };
};
