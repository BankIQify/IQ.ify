
export type FocusArea = 
  | "eleven_plus_prep"
  | "iq_improvement"
  | "focus_improvement"
  | "test_taking"
  | "problem_solving"
  | "time_management"
  | "confidence_building";

export const focusAreaLabels: Record<FocusArea, string> = {
  eleven_plus_prep: "Preparing for my 11+",
  iq_improvement: "Improving my IQ and Cognitive Reasoning",
  focus_improvement: "Helping improve my focus and concentration",
  test_taking: "Develop my test-taking abilities",
  problem_solving: "Improve my problem-solving skills",
  time_management: "Improve my time management abilities during exams",
  confidence_building: "Confidence building",
};
