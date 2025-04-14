import type { AnswerLayoutConfig } from "./types";

// Verbal reasoning sub-topic answer layout mappings
export const verbalReasoningLayouts: Record<string, AnswerLayoutConfig> = {
  // Verbal Reasoning sub-topics
  "analogies": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions asking to identify relationships between pairs of words."
  },
  "antonyms": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions asking to identify the opposite meaning of a word."
  },
  "comprehension": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Reading passages followed by questions about the content."
  },
  "sentence_completion": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Fill in the blank sentences with the most appropriate word."
  },
  "syllogisms": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Logical reasoning questions based on given statements."
  },
  "vocabulary": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions testing knowledge of word meanings and usage."
  },
  "verbal_classification": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Identify which word doesn't belong in a group."
  },
  "sequencing": {
    layout: "ordering",
    description: "Arrange sentences or events in the correct logical order."
  },
  "verbal_problems": {
    layout: "text",
    description: "Word problems requiring written solutions."
  },
  "synonyms": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions asking to identify words with similar meanings."
  },
  "word_relationships": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions about how words relate to each other."
  }
};
