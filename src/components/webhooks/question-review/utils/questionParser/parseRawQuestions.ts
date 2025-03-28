
import { QuestionItem } from "../../types";
import { extractSubTopicId } from './subTopicExtractor';
import { cleanText, normalizeLineEndings } from './textCleaner';
import { splitIntoQuestionBlocks, extractDifficultyBlocks } from './textSplitter';
import { parseQuestionBlock } from './parseQuestionBlock';

/**
 * Parses raw text input into structured question items
 */
export const parseRawQuestions = (rawText: string): QuestionItem[] => {
  if (!rawText) return [];

  const questions: QuestionItem[] = [];
  
  // Try to extract sub-topic ID if present
  const subTopicId = extractSubTopicId(rawText);
  
  // Clean and normalize the text
  const cleanedText = cleanText(rawText);
  const normalizedText = normalizeLineEndings(cleanedText);
  
  // Try to split text into question blocks
  const questionBlocks = splitIntoQuestionBlocks(normalizedText);
  
  // Skip the first block if it's not a question (often intro text)
  let startIndex = 0;
  if (questionBlocks.length > 0 && 
      questionBlocks[0]?.trim().length > 0 && 
      !questionBlocks[0].match(/^(question|prompt|instructions|note)/i) &&
      !questionBlocks[0].includes('?')) {
    startIndex = 1;
  }
  
  // Process each question block
  for (let i = startIndex; i < questionBlocks.length; i++) {
    const block = questionBlocks[i]?.trim();
    if (!block) continue;
    
    // Try to parse the question
    const item = parseQuestionBlock(block);
    
    // Add subTopicId if found
    if (subTopicId) {
      item.subTopicId = subTopicId;
    }
    
    // Only add if it looks like a valid question
    if (item.question && (item.question.includes('?') || item.options.length > 0)) {
      questions.push(item);
    }
  }
  
  // If we couldn't parse any questions, look for sections based on difficulty levels
  if (questions.length === 0) {
    const difficultyBlocks = extractDifficultyBlocks(normalizedText);
    
    for (const { difficulty, blocks } of difficultyBlocks) {
      for (const block of blocks) {
        if (!block.trim()) continue;
        
        const item = parseQuestionBlock(block);
        item.difficulty = difficulty;
        
        if (subTopicId) {
          item.subTopicId = subTopicId;
        }
        
        if (item.question) {
          questions.push(item);
        }
      }
    }
  }
  
  // If we still couldn't parse any questions, treat the whole text as one question
  if (questions.length === 0 && normalizedText.trim()) {
    const item: QuestionItem = {
      question: normalizedText.trim(),
      explanation: "",
      options: [],
      subTopicId
    };
    questions.push(item);
  }
  
  return questions;
};
