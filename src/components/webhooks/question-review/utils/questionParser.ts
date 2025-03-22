
import { QuestionItem } from "../types";

export const parseRawQuestions = (rawText: string): QuestionItem[] => {
  if (!rawText) return [];

  const questions: QuestionItem[] = [];
  
  // Try to extract sub-topic ID if present
  let subTopicId: string | undefined;
  const subTopicMatch = rawText.match(/(?:sub[-_]?topic[-_]?id|subtopicid):\s*([a-f0-9-]{36})/i);
  if (subTopicMatch && subTopicMatch[1]) {
    subTopicId = subTopicMatch[1];
  }

  // Split by number patterns like "1.", "2.", etc.
  const questionBlocks = rawText.split(/\n\s*\d+\.\s+/);
  
  // Skip the first block if it's not a question (often intro text)
  for (let i = 1; i < questionBlocks.length; i++) {
    const block = questionBlocks[i]?.trim();
    if (!block) continue;
    
    // Try to parse the question
    const item = parseQuestionBlock(block);
    
    // Add subTopicId if found
    if (subTopicId) {
      item.subTopicId = subTopicId;
    }
    
    questions.push(item);
  }
  
  return questions;
};

function parseQuestionBlock(block: string): QuestionItem {
  const lines = block.split(/\n+/);
  
  // First line is the question
  const question = lines[0]?.trim() || "";
  
  // Initialize the item
  const item: QuestionItem = {
    question,
    explanation: "",
  };
  
  let inOptionsSection = false;
  let inExplanationSection = false;
  let options: string[] = [];
  
  // Process the rest of the lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    // Look for options marked by a), b), c), etc.
    if (line.match(/^[a-z]\)\s+/i)) {
      inOptionsSection = true;
      inExplanationSection = false;
      options.push(line.replace(/^[a-z]\)\s+/i, ""));
      continue;
    }
    
    // Look for explanation section
    if (line.match(/^(explanation|answer|correct):?\s*/i)) {
      inOptionsSection = false;
      inExplanationSection = true;
      item.explanation = line.replace(/^(explanation|answer|correct):?\s*/i, "");
      continue;
    }
    
    // Look for explicitly marked correct answer
    const correctAnswerMatch = line.match(/^correct(?:\s+answer)?:?\s*([a-z])\)?/i);
    if (correctAnswerMatch) {
      // Extract the letter and map it to the corresponding option
      const letterIndex = correctAnswerMatch[1].toLowerCase().charCodeAt(0) - 97; // 'a' is 97 in ASCII
      if (options[letterIndex]) {
        item.correctAnswer = options[letterIndex];
      }
      continue;
    }
    
    // Continue adding to current section
    if (inOptionsSection) {
      options.push(line);
    } else if (inExplanationSection) {
      item.explanation += " " + line;
    } else {
      // If we're not in any specific section, add to the question
      item.question += " " + line;
    }
  }
  
  // Only set options if we found some
  if (options.length > 0) {
    item.options = options;
    
    // If no correct answer was explicitly marked, look for asterisk or other marker
    if (!item.correctAnswer) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].includes("*") || options[i].includes("[correct]")) {
          item.correctAnswer = options[i].replace(/[*\[correct\]]/g, "").trim();
          item.options[i] = options[i].replace(/[*\[correct\]]/g, "").trim();
          break;
        }
      }
    }
  }
  
  return item;
}
