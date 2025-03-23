
export interface Question {
  num1: number;
  num2: number;
  answer: number;
  operation: "multiply" | "divide";
  explanation: string;
  userAnswer?: number;
  isCorrect?: boolean;
}

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
