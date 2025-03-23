
import type { Question } from "./types";

export const generateQuestion = (tablesArray: number[]): Question => {
  // Get a random table from the selected tables
  const randomIndex = Math.floor(Math.random() * tablesArray.length);
  const selectedTable = tablesArray[randomIndex];
  
  // Decide if this will be multiplication or division
  const operation = Math.random() > 0.5 ? "multiply" : "divide";
  
  let num1: number;
  let num2: number;
  let answer: number;
  let explanation: string;
  
  if (operation === "multiply") {
    // For multiplication, one number is the selected table, the other is 1-12
    num1 = selectedTable;
    num2 = Math.floor(Math.random() * 12) + 1;
    answer = num1 * num2;
    explanation = `To find ${num1} × ${num2}, multiply ${num1} by ${num2}. ${num1} × ${num2} = ${answer}`;
  } else {
    // For division, the answer will be the divisor (1-12)
    num2 = selectedTable;
    answer = Math.floor(Math.random() * 12) + 1;
    num1 = num2 * answer;
    explanation = `To find ${num1} ÷ ${num2}, think of what number multiplied by ${num2} equals ${num1}. ${num2} × ${answer} = ${num1}, so ${num1} ÷ ${num2} = ${answer}`;
  }
  
  return {
    num1,
    num2,
    answer,
    operation,
    explanation
  };
};
