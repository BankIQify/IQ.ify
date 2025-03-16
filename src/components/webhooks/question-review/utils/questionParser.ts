
import { QuestionItem } from "../types";

/**
 * Parses raw text containing questions into structured QuestionItem objects
 */
export const parseRawQuestions = (rawText: string): QuestionItem[] => {
  // Split the text by the separator (triple dashes)
  const questionBlocks = rawText.split('---').filter(block => block.trim());
  
  return questionBlocks.map(block => {
    // Parse the question difficulty
    let difficulty = 'medium';
    const difficultyMatch = block.match(/^(Easy|Moderate|Challenging|Hard|Expert):/i);
    if (difficultyMatch) {
      const difficultyText = difficultyMatch[1].toLowerCase();
      // Map the text difficulties to our system's difficulty levels
      if (difficultyText === 'easy') difficulty = 'easy';
      else if (difficultyText === 'moderate') difficulty = 'medium';
      else if (difficultyText === 'challenging' || difficultyText === 'hard') difficulty = 'hard';
      else if (difficultyText === 'expert') difficulty = 'expert';
    }
    
    // Extract the question text
    const questionMatch = block.match(/Question:\s*(.*?)(?=A\)|Options:|Explanation:|$)/s);
    const question = questionMatch ? questionMatch[1].trim() : '';
    
    // Extract options for multiple choice questions
    const options: string[] = [];
    const optionsMatches = block.matchAll(/([A-D]\))\s*(.*?)(?=[A-D]\)|Explanation:|$)/gs);
    
    for (const match of optionsMatches) {
      options.push(match[2].trim());
    }
    
    // Extract the correct answer
    let correctAnswer = '';
    const explanationMatch = block.match(/Explanation:\s*(.*?)(?=$)/s);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';
    
    // Try to find the correct answer from the explanation
    const correctAnswerMatch = explanation.match(/The answer is ([A-D]\))\s*(.*?)\./) || 
                               explanation.match(/answer is ([A-D]\))\s*(.*?)[,\.]/) ||
                               explanation.match(/answer is\s*"?([^".,]+)"?/i);
    
    if (correctAnswerMatch) {
      // If the match includes the letter (e.g., "B) Echo"), extract just the answer text
      if (correctAnswerMatch[1].match(/[A-D]\)/)) {
        // Find the matching option in our options array
        const optionIndex = correctAnswerMatch[1].charCodeAt(0) - 65; // Convert A->0, B->1, etc.
        if (options[optionIndex]) {
          correctAnswer = options[optionIndex];
        } else if (correctAnswerMatch[2]) {
          correctAnswer = correctAnswerMatch[2].trim();
        }
      } else {
        correctAnswer = correctAnswerMatch[1].trim();
      }
    }
    
    // Build the question object
    const questionItem: QuestionItem = {
      question,
      explanation,
      difficulty
    };
    
    // Add options and correct answer if it's a multiple choice question
    if (options.length > 0) {
      questionItem.options = options;
      questionItem.correctAnswer = correctAnswer;
    }
    
    return questionItem;
  });
};
