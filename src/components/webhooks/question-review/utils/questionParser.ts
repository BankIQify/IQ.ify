
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
    const questionMatch = block.match(/Question:\s*(.*?)(?=A\)|Options:|Primary Options:|Explanation:|$)/s);
    const question = questionMatch ? questionMatch[1].trim() : '';
    
    // Check for dual choice format with primary and secondary options
    const hasPrimaryOptions = block.includes('Primary Options:') || block.includes('Primary options:');
    const hasSecondaryOptions = block.includes('Secondary Options:') || block.includes('Secondary options:');
    
    if (hasPrimaryOptions && hasSecondaryOptions) {
      // Handle dual choice questions
      const primaryOptions: string[] = [];
      const secondaryOptions: string[] = [];
      
      // Extract primary options
      const primaryOptionsSection = block.match(/Primary [Oo]ptions:(.*?)(?=Secondary [Oo]ptions:|Explanation:|$)/s);
      if (primaryOptionsSection) {
        const primaryOptionsMatches = primaryOptionsSection[1].matchAll(/([A-D]\))\s*(.*?)(?=[A-D]\)|$)/gs);
        for (const match of primaryOptionsMatches) {
          primaryOptions.push(match[2].trim());
        }
      }
      
      // Extract secondary options
      const secondaryOptionsSection = block.match(/Secondary [Oo]ptions:(.*?)(?=Explanation:|$)/s);
      if (secondaryOptionsSection) {
        const secondaryOptionsMatches = secondaryOptionsSection[1].matchAll(/([1-4]\.)\s*(.*?)(?=[1-4]\.|$)/gs);
        for (const match of secondaryOptionsMatches) {
          secondaryOptions.push(match[2].trim());
        }
      }
      
      // Extract correct answers from explanation
      const explanationMatch = block.match(/Explanation:\s*(.*?)(?=$)/s);
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';
      
      let correctPrimaryAnswer = '';
      let correctSecondaryAnswer = '';
      
      // Try to extract primary answer (usually in format like "The primary answer is B) Text")
      const primaryAnswerMatch = explanation.match(/primary answer is ([A-D]\))\s*(.*?)[,\.]/) || 
                                explanation.match(/primary answer is\s*"?([^".,]+)"?/i);
      
      if (primaryAnswerMatch) {
        // If the match includes the letter, extract just the answer text
        if (primaryAnswerMatch[1].match(/[A-D]\)/)) {
          const optionIndex = primaryAnswerMatch[1].charCodeAt(0) - 65; // Convert A->0, B->1, etc.
          if (primaryOptions[optionIndex]) {
            correctPrimaryAnswer = primaryOptions[optionIndex];
          } else if (primaryAnswerMatch[2]) {
            correctPrimaryAnswer = primaryAnswerMatch[2].trim();
          }
        } else {
          correctPrimaryAnswer = primaryAnswerMatch[1].trim();
        }
      }
      
      // Try to extract secondary answer
      const secondaryAnswerMatch = explanation.match(/secondary answer is ([1-4]\.)\s*(.*?)[,\.]/) || 
                                  explanation.match(/secondary answer is\s*"?([^".,]+)"?/i);
      
      if (secondaryAnswerMatch) {
        if (secondaryAnswerMatch[1] && secondaryAnswerMatch[1].match(/[1-4]\./)) {
          const optionIndex = parseInt(secondaryAnswerMatch[1]) - 1; // Convert 1->0, 2->1, etc.
          if (secondaryOptions[optionIndex]) {
            correctSecondaryAnswer = secondaryOptions[optionIndex];
          } else if (secondaryAnswerMatch[2]) {
            correctSecondaryAnswer = secondaryAnswerMatch[2].trim();
          }
        } else {
          correctSecondaryAnswer = secondaryAnswerMatch[1].trim();
        }
      }
      
      // Return dual choice question
      return {
        question,
        explanation,
        difficulty,
        primaryOptions,
        secondaryOptions,
        correctPrimaryAnswer,
        correctSecondaryAnswer
      };
    } else {
      // Handle standard multiple choice questions
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
      
      // Build the question object - if we have options, it's multiple choice, otherwise text
      if (options.length > 0) {
        return {
          question,
          explanation,
          options,
          correctAnswer,
          difficulty
        };
      } else {
        // Text answer format
        return {
          question,
          explanation,
          correctAnswer,
          difficulty
        };
      }
    }
  });
};
