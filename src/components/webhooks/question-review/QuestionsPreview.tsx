
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { WebhookEvent, QuestionItem } from "./types";
import type { Question } from "@/types/questions";

interface QuestionsPreviewProps {
  selectedEvent: WebhookEvent;
  editedQuestions: QuestionItem[];
}

export const QuestionsPreview = ({
  selectedEvent,
  editedQuestions
}: QuestionsPreviewProps) => {
  const getPreviewQuestions = (): Question[] => {
    if (!selectedEvent || !editedQuestions.length) return [];
    
    return editedQuestions.map((q: QuestionItem, index: number) => ({
      id: `preview-${index}`,
      content: {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        primaryOptions: q.primaryOptions,
        secondaryOptions: q.secondaryOptions,
        correctPrimaryAnswer: q.correctPrimaryAnswer,
        correctSecondaryAnswer: q.correctSecondaryAnswer
      },
      sub_topics: {
        name: selectedEvent.payload?.sub_topic_name || "Unknown"
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          See how the questions will appear in the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <QuestionsList questions={getPreviewQuestions()} />
      </CardContent>
    </Card>
  );
};
