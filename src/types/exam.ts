
export interface Question {
  id: string;
  content: {
    question: string;
    options?: string[];
    answer?: string | number;
    correctAnswer?: string | number; // Some questions use this format
    explanation?: string;
  };
  questionType: string;
  sub_topic_id?: string;
  sub_topic_name?: string;
}

export interface ExamData {
  id: string;
  name: string;
  category: "verbal" | "non_verbal" | "brain_training";
  is_standard: boolean;
  question_count: number;
  time_limit_minutes?: number;
}

export interface ExamResult {
  examId: string;
  score: number;
  userId: string;
}
