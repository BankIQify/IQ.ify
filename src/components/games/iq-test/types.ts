
import type { Difficulty } from "@/components/games/GameSettings";

export interface IQGameProps {
  difficulty: Difficulty;
}

export interface QuestionDisplayProps {
  currentQuestion: any;
  selectedAnswer: string;
  setSelectedAnswer: (answer: string) => void;
  showExplanation: boolean;
  handleAnswer: () => void;
  moveToNextQuestion: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export interface GameStatsHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  timer: number;
  score: number;
  questionType: string;
  progressPercentage: number;
}

export interface ResultsSummaryProps {
  score: number;
  answeredQuestions: number[];
  totalQuestions: number;
  questionTypes: Record<string, number>;
  onReset: () => void;
}
