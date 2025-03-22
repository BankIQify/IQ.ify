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

  // First try to split by numbered questions (e.g., "1.", "2.", etc.)
  let questionBlocks = rawText.split(/\n\s*\d+\.\s+/);
  
  // If we didn't find multiple questions using numbers, try other formats
  if (questionBlocks.length <= 1) {
    // Try splitting by "Question X:" format
    questionBlocks = rawText.split(/\n\s*Question\s*\d+\s*[:.-]\s*/i);
    
    // If still no luck, try splitting by double newlines (paragraph breaks)
    if (questionBlocks.length <= 1 && rawText.includes("\n\n")) {
      questionBlocks = rawText.split(/\n\n+/);
    }
  }
  
  // Skip the first block if it's not a question (often intro text)
  const startIndex = questionBlocks[0]?.trim().length > 0 && 
                      !questionBlocks[0].match(/^(question|prompt|instructions|note)/i) ? 0 : 1;
  
  for (let i = startIndex; i < questionBlocks.length; i++) {
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
  
  // First line is typically the question
  const question = lines[0]?.trim() || "";
  
  // Initialize the item
  const item: QuestionItem = {
    question,
    explanation: "",
    options: [],
  };
  
  let inOptionsSection = false;
  let inExplanationSection = false;
  let currentOptions: string[] = [];
  let currentExplanation = "";
  let correctOptionLetter: string | null = null;
  
  // Process the rest of the lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    // Check for options marked by letters like a), b), c), A), B), C), etc.
    const optionMatch = line.match(/^([a-z])[).]\s+(.+)/i);
    if (optionMatch) {
      inOptionsSection = true;
      inExplanationSection = false;
      
      const optionLetter = optionMatch[1].toLowerCase();
      const optionText = optionMatch[2].trim();
      
      // Check if this option is marked as correct
      const isCorrect = optionText.includes("*") || 
                         optionText.includes("[correct]") || 
                         optionText.toLowerCase().includes("(correct)");
      
      // Store the letter of the correct option if marked
      if (isCorrect) {
        correctOptionLetter = optionLetter;
        // Remove the correct markers from the option text
        currentOptions.push(optionText.replace(/[*\[\(]correct[\]\)]/gi, "").trim());
      } else {
        currentOptions.push(optionText);
      }
      continue;
    }
    
    // Look for explanation section with various labels
    const explanationMatch = line.match(/^(explanation|answer|solution|correct|rationale|reason):?\s*(.*)/i);
    if (explanationMatch) {
      inOptionsSection = false;
      inExplanationSection = true;
      currentExplanation = explanationMatch[2] || "";
      continue;
    }
    
    // Look for explicitly marked correct answer
    const correctAnswerMatch = line.match(/^correct(?:\s+answer)?:?\s*([a-z])[).]?\s*(.*)/i);
    if (correctAnswerMatch) {
      correctOptionLetter = correctAnswerMatch[1].toLowerCase();
      // If there's content after the letter, add it to the explanation
      if (correctAnswerMatch[2]) {
        currentExplanation += " " + correctAnswerMatch[2];
        inExplanationSection = true;
      }
      continue;
    }
    
    // Process based on current section
    if (inOptionsSection) {
      // Check if this line might be continuing a previous option
      if (currentOptions.length > 0 && !line.match(/^[a-z][).]/i)) {
        // Append to the last option
        currentOptions[currentOptions.length - 1] += " " + line;
      } else {
        // Otherwise consider it a new option without letter marker
        currentOptions.push(line);
      }
    } else if (inExplanationSection) {
      currentExplanation += " " + line;
    } else {
      // If we're not in any specific section, add to the question
      item.question += " " + line;
    }
  }
  
  // Only set options if we found some
  if (currentOptions.length > 0) {
    item.options = currentOptions;
    
    // Set the correct answer if we identified it
    if (correctOptionLetter && currentOptions.length > 0) {
      const index = correctOptionLetter.charCodeAt(0) - 'a'.charCodeAt(0);
      if (index >= 0 && index < currentOptions.length) {
        item.correctAnswer = currentOptions[index];
      }
    }
    
    // Look for asterisk or other marker if we didn't find an explicit correct answer
    if (!item.correctAnswer) {
      for (let i = 0; i < currentOptions.length; i++) {
        const option = currentOptions[i];
        const rawOption = lines.find(line => line.includes(option));
        
        if (rawOption && (
            rawOption.includes("*") || 
            rawOption.includes("[correct]") || 
            rawOption.toLowerCase().includes("(correct)")
        )) {
          item.correctAnswer = option;
          break;
        }
      }
    }
  }
  
  // Set the explanation if we found one
  if (currentExplanation) {
    item.explanation = currentExplanation.trim();
  }
  
  // Handle text answer format (no options)
  if (item.options?.length === 0 && !item.correctAnswer) {
    // Look for a line that might contain the answer but isn't explicitly marked
    const potentialAnswer = lines.find(line => 
      line.match(/^(answer|solution|correct):?\s+(.+)/i)
    );
    
    if (potentialAnswer) {
      const answerMatch = potentialAnswer.match(/^(answer|solution|correct):?\s+(.+)/i);
      if (answerMatch && answerMatch[2]) {
        item.correctAnswer = answerMatch[2].trim();
      }
    }
  }
  
  return item;
}
