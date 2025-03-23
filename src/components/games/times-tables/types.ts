
export interface Question {
  num1: number;
  num2: number;
  answer: number;
  operation: "multiply" | "divide";
  userAnswer?: number;
  isCorrect?: boolean;
  explanation?: string;
}
