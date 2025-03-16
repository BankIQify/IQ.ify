
export interface QuestionItem {
  question: string;
  explanation: string;
  options?: string[];
  correctAnswer?: string;
  primaryOptions?: string[];
  secondaryOptions?: string[];
  correctPrimaryAnswer?: string;
  correctSecondaryAnswer?: string;
  difficulty?: string;
  [key: string]: any;
}

export interface WebhookEventPayload {
  sub_topic_id: string;
  sub_topic_name?: string;
  prompt?: string;
  questions: QuestionItem[];
  raw_text?: string; // Add support for raw text input
  [key: string]: any;
}

export interface WebhookEvent {
  id: string;
  created_at: string;
  processed: boolean;
  processed_at?: string;
  source: string;
  event_type: string;
  payload: WebhookEventPayload;
}
