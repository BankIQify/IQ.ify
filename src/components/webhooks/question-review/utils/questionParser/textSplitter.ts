
import { questionFormats } from './regexPatterns';
import { QuestionBlock } from './types';

/**
 * Splits normalized text into blocks that likely represent individual questions
 */
export const splitIntoQuestionBlocks = (normalizedText: string): QuestionBlock[] => {
  let questionBlocks: QuestionBlock[] = [];
  
  // Strategy 1: Split by numbered questions (e.g., "1.", "2.", etc.)
  questionBlocks = normalizedText.split(questionFormats.numbered);
  
  // If we didn't find multiple questions using numbers, try other formats
  if (questionBlocks.length <= 1) {
    // Strategy 2: Try splitting by "Question X:" format
    questionBlocks = normalizedText.split(questionFormats.questionLabeled);
    
    // Strategy 3: If still no luck, try splitting by double newlines (paragraph breaks)
    if (questionBlocks.length <= 1 && normalizedText.includes("\n\n")) {
      questionBlocks = normalizedText.split(/\n\n+/);
    }
    
    // Strategy 4: Look for markdown-style headings or word "Easy:", "Medium:", "Hard:"
    if (questionBlocks.length <= 1) {
      questionBlocks = normalizedText.split(questionFormats.headingsOrDifficulty);
    }
    
    // Strategy 5: Try to split by single question blocks with options
    if (questionBlocks.length <= 1) {
      // Split where there's a potential question followed by options
      const potentialBlocks = normalizedText.match(/(.+?)(?:\n\s*[a-d][).]\s+.+?\n\s*[a-d][).]\s+.+?)+/gi);
      if (potentialBlocks && potentialBlocks.length > 0) {
        questionBlocks = potentialBlocks;
      }
    }
  }
  
  return questionBlocks.filter(block => block?.trim());
};

/**
 * Extracts question blocks based on difficulty sections
 */
export const extractDifficultyBlocks = (normalizedText: string): { difficulty: string, blocks: QuestionBlock[] }[] => {
  const results: { difficulty: string, blocks: QuestionBlock[] }[] = [];
  const difficultyBlocks = normalizedText.match(questionFormats.difficultySections);
  
  if (!difficultyBlocks || difficultyBlocks.length === 0) {
    return results;
  }
  
  for (const block of difficultyBlocks) {
    // Extract difficulty from the heading
    const difficultyMatch = block.match(questionFormats.difficultyMatch);
    const difficulty = difficultyMatch ? difficultyMatch[1].toLowerCase() : 'medium';
    
    // Split the section into individual questions
    const sectionText = block.replace(questionFormats.difficultyMatch, '').trim();
    const sectionQuestions = sectionText.split(/\n\s*\d+\.\s+/);
    
    // Add resulting blocks with their difficulty
    results.push({
      difficulty,
      blocks: sectionQuestions.filter(q => q?.trim())
    });
  }
  
  return results;
};
