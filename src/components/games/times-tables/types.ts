
export type Question = {
  num1: number;
  num2: number;
  operation: "multiply" | "divide";
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
};

