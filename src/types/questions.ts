
export type QuestionContent = {
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  imageUrl?: string;
  // Add dual choice properties
  primaryOptions?: string[];
  secondaryOptions?: string[];
  correctPrimaryAnswer?: string;
  correctSecondaryAnswer?: string;
};

export type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

export type Question = {
  id: string;
  content: QuestionContent;
  sub_topics: {
    name: string;
  };
};
