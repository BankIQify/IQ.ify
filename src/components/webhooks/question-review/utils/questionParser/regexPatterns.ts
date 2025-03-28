
// Regex patterns for parsing question content

// Patterns for extracting sub-topic IDs
export const subTopicIdPatterns = [
  /sub[_-]?topic[_-]?id:?\s*["']?([a-f0-9-]{36})["']?/i,
  /subtopic[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i,
  /subject[_-]?uuid:?\s*["']?([a-f0-9-]{36})["']?/i, // Sometimes mistakenly used
  /"subtopic(?:UUID|Id|_id)"\s*:\s*"([a-f0-9-]{36})"/i,
  /"sub_topic_id"\s*:\s*"([a-f0-9-]{36})"/i
];

// Patterns for question formats
export const questionFormats = {
  // Strategy 1: Split by numbered questions (e.g., "1.", "2.", etc.)
  numbered: /\n\s*\d+\.\s+/,
  
  // Strategy 2: "Question X:" format
  questionLabeled: /\n\s*Question\s*\d+\s*[:.-]\s*/i,
  
  // Strategy 4: Markdown headings or difficulty labels
  headingsOrDifficulty: /\n\s*(?:#{1,3}\s+|Easy:|Medium:|Hard:|Difficulty:)/i,
  
  // For identifying sections based on difficulty
  difficultySections: /(?:Easy|Medium|Hard):([\s\S]*?)(?=(?:Easy|Medium|Hard):|$)/gi,
  
  // For extracting the difficulty level
  difficultyMatch: /^(Easy|Medium|Hard):/i,
  
  // Option patterns
  optionPattern: /^([a-z])[).]\s+(.+)/i,
  
  // Explanation section patterns
  explanationPattern: /^(explanation|answer|solution|correct|rationale|reason):?\s*(.*)/i,
  correctAnswerPattern: /^correct(?:\s+answer)?:?\s*([a-z])[).]?\s*(.*)/i
};

// Patterns for cleaning text
export const cleaningPatterns = {
  headings: /###\s*[^#\n]+/g,
  hash: /#/g,
  questionNumbering: /^\d+[\.\)]\s+/
};
