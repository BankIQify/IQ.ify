export type QuestionContent = {
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  imageUrl?: string;
  answerImageUrl?: string;
  // Dual choice properties
  primaryOptions?: string[];
  secondaryOptions?: string[];
  correctPrimaryAnswer?: string;
  correctSecondaryAnswer?: string;
};

export type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

export type Question = {
  id: string;
  content: QuestionContent;
  question_type: QuestionType;
  sub_topics: {
    id: string;
    name: string;
    question_sections: {
      category: QuestionCategory;
    }[];
  }[];
};

// Updated to ensure it matches what's expected in Supabase and the code
export type QuestionType = 'multiple_choice' | 'text' | 'image' | 'dual_choice';
