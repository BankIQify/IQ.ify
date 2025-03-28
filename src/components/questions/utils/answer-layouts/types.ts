
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
