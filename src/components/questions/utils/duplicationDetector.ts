
import type { Question } from "@/types/questions";

export interface QuestionWithDuplicateFlag extends Question {
  hasSimilar: boolean;
  similarityScore?: number;
  similarTo?: string[];
}

/**
 * Calculates the similarity between two strings using Levenshtein distance
 * @param str1 First string to compare
 * @param str2 Second string to compare
 * @returns A score between 0 and 1, where 1 means identical
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  
  // Normalize strings: lowercase, remove extra spaces
  const s1 = str1.toLowerCase().trim().replace(/\s+/g, ' ');
  const s2 = str2.toLowerCase().trim().replace(/\s+/g, ' ');
  
  if (s1 === s2) return 1.0;
  
  // Calculate Levenshtein distance
  const len1 = s1.length;
  const len2 = s2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1.0;
  
  // Use dynamic programming for Levenshtein distance
  const dp: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;
  
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  // Convert distance to similarity score (0 to 1)
  const distance = dp[len1][len2];
  return 1 - distance / maxLen;
}

/**
 * Detects duplicate or very similar questions based on content
 * 
 * @param questions Array of questions to check for duplicates
 * @returns Array of questions with a duplicate flag and similarity info
 */
export function detectDuplicateQuestions(questions: Question[]) {
  const SIMILARITY_THRESHOLD = 0.85; // Adjust this threshold to change sensitivity
  const questionsWithDuplicateFlags: QuestionWithDuplicateFlag[] = [];
  let duplicatesFound = false;
  
  // Create a map to track questions by their similarity groups
  const similarityGroups: Map<string, string[]> = new Map();
  
  for (let i = 0; i < questions.length; i++) {
    const current = questions[i];
    const questionText = current.content.question;
    let hasSimilar = false;
    let highestSimilarity = 0;
    let similarIds: string[] = [];
    
    // Compare with all previously processed questions
    for (let j = 0; j < i; j++) {
      const previous = questions[j];
      const previousText = previous.content.question;
      
      const similarity = calculateStringSimilarity(questionText, previousText);
      
      if (similarity > SIMILARITY_THRESHOLD) {
        hasSimilar = true;
        duplicatesFound = true;
        highestSimilarity = Math.max(highestSimilarity, similarity);
        similarIds.push(previous.id);
        
        // Update the similarity group for the previous question
        if (similarityGroups.has(previous.id)) {
          const group = similarityGroups.get(previous.id)!;
          group.push(current.id);
          similarityGroups.set(current.id, group);
        } else {
          similarityGroups.set(previous.id, [current.id]);
          similarityGroups.set(current.id, [previous.id]);
        }
      }
    }
    
    questionsWithDuplicateFlags.push({
      ...current,
      hasSimilar,
      similarityScore: highestSimilarity > 0 ? highestSimilarity : undefined,
      similarTo: similarIds.length > 0 ? similarIds : undefined
    });
  }
  
  return {
    questionsWithDuplicateFlags,
    duplicatesFound
  };
}
