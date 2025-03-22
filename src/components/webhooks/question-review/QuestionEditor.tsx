
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventDetails } from "./EventDetails";
import { QuestionEditCard } from "./QuestionEditCard";
import { WebhookEvent, QuestionItem } from "./types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseRawQuestions } from "./utils/questionParser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  
  // Get subject category if we have a sub_topic_id
  const { data: subTopicDetails } = useQuery({
    queryKey: ['subTopicDetails', selectedEvent.payload.sub_topic_id],
    queryFn: async () => {
      if (!selectedEvent.payload.sub_topic_id) return null;
      
      const { data: subTopic, error } = await supabase
        .from('sub_topics')
        .select(`
          id,
          name,
          section_id,
          question_sections:section_id (
            category
          )
        `)
        .eq('id', selectedEvent.payload.sub_topic_id)
        .single();
      
      if (error) {
        console.error('Error fetching sub topic details:', error);
        return null;
      }
      
      return subTopic;
    },
    enabled: !!selectedEvent.payload.sub_topic_id
  });

  const category = subTopicDetails?.question_sections?.category || 'verbal';

  const handleParseRawText = () => {
    try {
      const parsedQuestions = parseRawQuestions(rawText);
      if (parsedQuestions.length === 0) {
        setParseError("No questions could be parsed from the text. Please check the format.");
        return;
      }
      
      // Add subTopicId to each question
      const questionsWithSubTopic = parsedQuestions.map(q => ({
        ...q,
        subTopicId: selectedEvent.payload.sub_topic_id
      }));
      
      onSetQuestions(questionsWithSubTopic);
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
                category={category}
                selectedSubTopicId={selectedEvent.payload.sub_topic_id}
                onUpdateQuestion={(updatedQuestion) => onUpdateQuestion(index, updatedQuestion)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
