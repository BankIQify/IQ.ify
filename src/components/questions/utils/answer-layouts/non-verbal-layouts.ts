
import type { AnswerLayoutConfig } from "./types";

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
