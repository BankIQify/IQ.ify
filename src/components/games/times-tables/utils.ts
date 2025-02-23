
import { Question } from "./types";

export const generateQuestion = (selectedTables: number[]): Question | null => {
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

