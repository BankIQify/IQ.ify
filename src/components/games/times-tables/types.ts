
/**
 * Question represents a single math problem in the Times Tables game.
 * It includes:
 * - The two numbers in the question (num1, num2)
 * - The expected answer
 * - The operation (multiplication or division)
 * - An explanation of the solution
 * - The user's answer (after answering)
 * - Whether the user's answer was correct
 */
export interface Question {
  num1: number;
  num2: number;
  answer: number;
  operation: "multiply" | "divide";
  explanation: string;
  userAnswer?: number;
  isCorrect?: boolean;
}

/**
 * Props for the AnswerInput component
 */
export interface AnswerInputProps {
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  showFeedback: boolean;
  isCorrect: boolean;
  currentQuestion: Question | null;
}

/**
 * Props for the GameControls component
 */
export interface GameControlsProps {
  selectedTables: number[];
  timeLimit: number;
  onToggleTable: (table: number) => void;
  onTimeLimitChange: (limit: number) => void;
  onStart: () => void;
}

/**
 * Props for the ActiveGame component
 */
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
