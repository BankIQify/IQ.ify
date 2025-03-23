
import type { Question } from "./types";

export interface AnswerInputProps {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showFeedback: boolean;
  isCorrect: boolean;
  currentQuestion: Question | null;
}

export interface GameControlsProps {
  selectedTables: number[];
  timeLimit: number;
  onToggleTable: (table: number) => void;
  onTimeLimitChange: (limit: number) => void;
  onStart: () => void;
}

export interface ActiveGameProps {
  timer: number;
  currentQuestion: Question | null;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showFeedback: boolean;
  isCorrect: boolean;
  progressPercentage: number;
}

// Note: Reusing the existing Question interface from types.ts
