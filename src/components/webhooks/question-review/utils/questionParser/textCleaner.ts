
import { cleaningPatterns } from './regexPatterns';

/**
 * Cleans raw text by removing problematic characters
 */
export const cleanText = (rawText: string): string => {
  if (!rawText) return '';
  
  return rawText
    .replace(cleaningPatterns.headings, '\n') // Replace headings with newlines 
    .replace(cleaningPatterns.hash, '') // Remove any remaining # characters
    .trim();
};

/**
 * Normalizes line endings in text
 */
export const normalizeLineEndings = (text: string): string => {
  return text.replace(/\r\n/g, '\n');
};

/**
 * Cleans the question text by removing numbering at the start
 */
export const cleanQuestionText = (text: string): string => {
  return text.replace(cleaningPatterns.questionNumbering, '').trim();
};
