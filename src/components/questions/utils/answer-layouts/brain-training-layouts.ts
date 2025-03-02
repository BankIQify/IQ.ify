
import type { AnswerLayoutConfig } from "./types";

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
