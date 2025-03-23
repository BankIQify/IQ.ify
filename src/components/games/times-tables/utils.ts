
import type { Question } from "./types";

/**
 * Generates a random multiplication or division question based on the selected times tables.
 * 
 * @param tablesArray - Array of numbers representing the selected times tables
 * @returns A Question object containing the question details
 */
export const generateQuestion = (tablesArray: number[]): Question => {
  // Select a random times table from the user's selection
  const randomIndex = Math.floor(Math.random() * tablesArray.length);
  const selectedTable = tablesArray[randomIndex];
  
  // Randomly choose between multiplication and division
  const operation = Math.random() > 0.5 ? "multiply" : "divide";
  
  let num1: number;
  let num2: number;
  let answer: number;
  let explanation: string;
  
  if (operation === "multiply") {
    // For multiplication questions:
    // First number is the selected times table
    // Second number is a random number between 1-12
    num1 = selectedTable;
    num2 = Math.floor(Math.random() * 12) + 1;
    answer = num1 * num2;
    explanation = `To find ${num1} × ${num2}, multiply ${num1} by ${num2}. ${num1} × ${num2} = ${answer}`;
  } else {
    // For division questions:
    // The divisor is the selected times table
    // The answer will be a random number between 1-12
    // The dividend (num1) is calculated as divisor × answer
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
