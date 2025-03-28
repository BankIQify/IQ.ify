
import type { AnswerLayoutConfig } from "./types";

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
