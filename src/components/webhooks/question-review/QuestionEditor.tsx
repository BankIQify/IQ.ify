
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventDetails } from "./EventDetails";
import { QuestionEditCard } from "./QuestionEditCard";
import { WebhookEvent, QuestionItem } from "./types";

interface QuestionEditorProps {
  selectedEvent: WebhookEvent;
  editedQuestions: QuestionItem[];
  isLoading: boolean;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionItem) => void;
  onSaveQuestions: () => void;
  onDiscardEvent: () => void;
}

export const QuestionEditor = ({
  selectedEvent,
  editedQuestions,
  isLoading,
  onUpdateQuestion,
  onSaveQuestions,
  onDiscardEvent
}: QuestionEditorProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Edit Questions</CardTitle>
          <CardDescription>
            Review and edit questions before saving them to the database
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onDiscardEvent}
            disabled={isLoading}
          >
            Discard
          </Button>
          <Button 
            onClick={onSaveQuestions}
            disabled={isLoading || editedQuestions.length === 0}
          >
            Save All Questions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <EventDetails event={selectedEvent} />

        <div className="space-y-6">
          {editedQuestions.map((question, index) => (
            <QuestionEditCard 
              key={index}
              question={question}
              index={index}
              onUpdateQuestion={onUpdateQuestion}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
