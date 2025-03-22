
import type { Question } from "@/types/questions";
import { calculateStringSimilarity } from "./stringSimilarity";

export interface QuestionWithDuplicateFlag extends Question {
  hasSimilar: boolean;
  similarityScore?: number;
  similarTo?: string[];
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
