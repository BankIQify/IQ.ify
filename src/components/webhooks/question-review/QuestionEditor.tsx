
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventDetails } from "./EventDetails";
import { QuestionEditCard } from "./QuestionEditCard";
import { WebhookEvent, QuestionItem } from "./types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseRawQuestions } from "./utils/questionParser";

interface QuestionEditorProps {
  selectedEvent: WebhookEvent;
  editedQuestions: QuestionItem[];
  isLoading: boolean;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionItem) => void;
  onSaveQuestions: () => void;
  onDiscardEvent: () => void;
  onSetQuestions: (questions: QuestionItem[]) => void;
}

export const QuestionEditor = ({
  selectedEvent,
  editedQuestions,
  isLoading,
  onUpdateQuestion,
  onSaveQuestions,
  onDiscardEvent,
  onSetQuestions
}: QuestionEditorProps) => {
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [rawText, setRawText] = useState(selectedEvent.payload.raw_text || "");
  const [parseError, setParseError] = useState<string | null>(null);

  const handleParseRawText = () => {
    try {
      const parsedQuestions = parseRawQuestions(rawText);
      if (parsedQuestions.length === 0) {
        setParseError("No questions could be parsed from the text. Please check the format.");
        return;
      }
      onSetQuestions(parsedQuestions);
      setShowRawEditor(false);
      setParseError(null);
    } catch (error) {
      console.error("Error parsing questions:", error);
      setParseError("Failed to parse questions. Please check the format.");
    }
  };

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
            onClick={() => setShowRawEditor(!showRawEditor)}
          >
            {showRawEditor ? "Show Formatted" : "Edit Raw Text"}
          </Button>
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

        {showRawEditor ? (
          <div className="space-y-4">
            <Textarea 
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
              rows={15}
              placeholder="Paste your raw question text here..."
              className="font-mono text-sm"
            />
            
            {parseError && (
              <Alert variant="destructive">
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end">
              <Button onClick={handleParseRawText}>
                Parse Questions
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {editedQuestions.map((question, index) => (
              <QuestionEditCard 
                key={index}
                question={question}
                index={index}
                onUpdateQuestion={(updatedQuestion) => onUpdateQuestion(index, updatedQuestion)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
