export type MainSubject = 
  | 'verbal_reasoning'
  | 'non_verbal_reasoning'
  | 'brain_training';

export type SubjectType = MainSubject;

export type SubTopic = {
  id: string;
  name: string;
  mainSubject: MainSubject;
  description: string;
  path: string;
};

export interface SubTopicPerformance {
  id: string;
  user_id: string;
  subtopic_id: string;
  average_score: number;
  total_attempts: number;
  last_attempt_at: string;
  created_at: string;
  updated_at: string;
}

export interface WeakSubTopic extends SubTopic {
  averageScore: number;
  totalAttempts: number;
  mainSubjectInfo: {
    icon: string;
    iconColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
}

export interface SubjectRecommendation {
  title: string;
  type: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  link: string;
  averageScore: number;
}

export interface SubjectPerformance {
  subject: MainSubject;
  score: number;
} 