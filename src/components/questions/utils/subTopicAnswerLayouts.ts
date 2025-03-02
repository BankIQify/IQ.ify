import type { QuestionCategory } from "@/types/questions";

// Define the different types of answer layouts we support
export type AnswerLayout = 
  | "multiple_choice" 
  | "text" 
  | "image" 
  | "matching" 
  | "ordering" 
  | "completion" 
  | "true_false"
  | "dual_choice";

// This interface helps define what fields are expected for each answer layout
export interface AnswerLayoutConfig {
  layout: AnswerLayout;
  optionsCount?: number;
  requiresImage?: boolean;
  description: string;
  secondaryOptionsCount?: number;
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

// Non-verbal reasoning sub-topic layouts
export const nonVerbalReasoningLayouts: Record<string, AnswerLayoutConfig> = {
  "pattern_recognition": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Identify the pattern and select the correct next item."
  },
  "spatial_reasoning": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Questions testing ability to manipulate shapes mentally."
  },
  "matrix_problems": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Complete the matrix by identifying the correct pattern."
  },
  "dual_selection": {
    layout: "dual_choice",
    optionsCount: 4,
    secondaryOptionsCount: 4,
    description: "Select one option from each of the two lists to complete the pattern."
  }
};

// Brain training sub-topic layouts
export const brainTrainingLayouts: Record<string, AnswerLayoutConfig> = {
  "memory_exercises": {
    layout: "multiple_choice",
    optionsCount: 4,
    description: "Test your memory by recalling information."
  },
  "logic_puzzles": {
    layout: "text",
    description: "Solve logical problems and provide the answer."
  },
  "math_problems": {
    layout: "text",
    description: "Solve mathematical problems and provide the numerical answer."
  },
  "pattern_completion": {
    layout: "dual_choice",
    optionsCount: 3,
    secondaryOptionsCount: 3,
    description: "Select one item from each list to complete the pattern correctly."
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
  
  // Convert the name to lowercase and replace spaces with underscores for lookup
  const normalizedName = subTopic.name.toLowerCase().replace(/\s+/g, '_');
  
  // Handle layouts based on category
  if (category === "verbal") {
    return verbalReasoningLayouts[normalizedName] || null;
  } else if (category === "non_verbal") {
    return nonVerbalReasoningLayouts[normalizedName] || null;
  } else if (category === "brain_training") {
    return brainTrainingLayouts[normalizedName] || null;
  }
  
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
    
    case "dual_choice":
      return {
        question: "",
        primaryOptions: Array(layoutConfig.optionsCount || 4).fill(""),
        secondaryOptions: Array(layoutConfig.secondaryOptionsCount || 4).fill(""),
        correctPrimaryAnswer: "",
        correctSecondaryAnswer: "",
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
