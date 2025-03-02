
import type { QuestionCategory } from "@/types/questions";

// Define the different types of answer layouts we support
export type AnswerLayout = 
  | "multiple_choice" 
  | "text" 
  | "image" 
  | "matching" 
  | "ordering" 
  | "completion" 
  | "true_false";

// This interface helps define what fields are expected for each answer layout
export interface AnswerLayoutConfig {
  layout: AnswerLayout;
  optionsCount?: number;
  requiresImage?: boolean;
  description: string;
}

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
    description: "Questions testing knowledge of word meanings."
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
  }
};

// Export a function to get the answer layout for a specific sub-topic
export const getSubTopicLayout = (
  subTopicId: string, 
  subTopics: Array<{ id: string; name: string }>,
  category: QuestionCategory
): AnswerLayoutConfig | null => {
  if (!subTopicId || !subTopics || subTopics.length === 0) {
    return null;
  }
  
  // Find the sub-topic by ID
  const subTopic = subTopics.find(st => st.id === subTopicId);
  if (!subTopic) {
    return null;
  }
  
  // Handle verbal reasoning sub-topics
  if (category === "verbal") {
    // Convert the name to lowercase and replace spaces with underscores for lookup
    const normalizedName = subTopic.name.toLowerCase().replace(/\s+/g, '_');
    return verbalReasoningLayouts[normalizedName] || null;
  }
  
  // For other categories, return null for now
  return null;
};

// Utility function to generate the appropriate content structure based on layout
export const generateContentStructure = (layoutConfig: AnswerLayoutConfig | null) => {
  if (!layoutConfig) {
    // Default structure
    return {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: ""
    };
  }

  switch (layoutConfig.layout) {
    case "multiple_choice":
      return {
        question: "",
        options: Array(layoutConfig.optionsCount || 4).fill(""),
        correctAnswer: "",
        explanation: ""
      };
    
    case "text":
      return {
        question: "",
        correctAnswer: "",
        explanation: ""
      };
    
    case "image":
      return {
        question: "",
        imageUrl: "",
        answerImageUrl: "",
        explanation: ""
      };
    
    case "matching":
      return {
        question: "",
        pairs: [
          { left: "", right: "" },
          { left: "", right: "" }
        ],
        explanation: ""
      };
    
    case "ordering":
      return {
        question: "",
        items: ["", ""],
        correctOrder: [0, 1],
        explanation: ""
      };
    
    case "completion":
      return {
        question: "",
        text: "",
        blanks: [""],
        explanation: ""
      };
    
    case "true_false":
      return {
        question: "",
        statements: [""],
        answers: [true],
        explanation: ""
      };
    
    default:
      return {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: ""
      };
  }
};
