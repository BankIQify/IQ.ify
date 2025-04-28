import { evaluate } from 'mathjs';

export const evaluateExpression = (expression: string, allowedNumbers: number[]): number => {
  // Remove all whitespace
  const cleanExpression = expression.replace(/\s/g, "");
  
  // Check if expression only contains allowed characters
  if (!/^[0-9+\-*/()]+$/.test(cleanExpression)) {
    throw new Error("Expression contains invalid characters");
  }
  
  // Check if expression uses only the allowed numbers
  const numbersInExpression = cleanExpression.match(/\d+/g) || [];
  const expressionNumbers = numbersInExpression.map(Number);
  
  // Sort both arrays to compare
  const sortedAllowedNumbers = [...allowedNumbers].sort();
  const sortedExpressionNumbers = [...expressionNumbers].sort();
  
  if (JSON.stringify(sortedExpressionNumbers) !== JSON.stringify(sortedAllowedNumbers)) {
    throw new Error("Expression uses incorrect numbers");
  }
  
  // Evaluate the expression - using eval is safe here because:
  // 1. We validate the input string to only contain numbers and operators
  // 2. We verify that all numbers used match the allowed numbers
  // 3. The expression is limited to basic arithmetic operations
  try {
    // eslint-disable-next-line no-eval
    return eval(cleanExpression);
  } catch (e) {
    throw new Error("Invalid expression");
  }
};
