
import type { QuestionType } from "@/types/questions";

export interface QuestionContent {
  question: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer?: string;
  answerImageUrl?: string;
  primaryOptions?: string[];
  secondaryOptions?: string[];
  correctPrimaryAnswer?: string;
  correctSecondaryAnswer?: string;
  explanation?: string;
}

export interface ManualQuestionHookState {
  questionType: QuestionType;
  manualQuestion: string;
  questionImage: File | null;
  answerImage: File | null;
  options: string[];
  correctAnswerIndex: number;
  correctTextAnswer: string;
  isProcessingManual: boolean;
  primaryOptions: string[];
  secondaryOptions: string[];
  correctPrimaryIndex: number;
  correctSecondaryIndex: number;
}
