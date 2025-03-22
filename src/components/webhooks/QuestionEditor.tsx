
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventDetails } from "./question-review/EventDetails";
import { QuestionEditCard } from "./question-review/QuestionEditCard";
import { WebhookEvent, QuestionItem } from "./question-review/types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseRawQuestions } from "./question-review/utils/questionParser";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

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
  const [isParsing, setIsParsing] = useState(false);
  
  // Get subject category if we have a sub_topic_id
  const { data: subTopicDetails, isLoading: isLoadingSubTopic } = useQuery({
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
      setIsParsing(true);
      setParseError(null);
      
      if (!rawText.trim()) {
        setParseError("Raw text cannot be empty");
        return;
      }
      
      const parsedQuestions = parseRawQuestions(rawText);
      if (parsedQuestions.length === 0) {
        setParseError("No questions could be parsed from the text. Please check the format.");
        return;
      }
      
      // Add subTopicId to each question
      const questionsWithSubTopic = parsedQuestions.map(q => ({
        ...q,
        subTopicId: q.subTopicId || selectedEvent.payload.sub_topic_id
      }));
      
      onSetQuestions(questionsWithSubTopic);
      setShowRawEditor(false);
      setParseError(null);
    } catch (error) {
      console.error("Error parsing questions:", error);
      setParseError(error instanceof Error ? error.message : "Failed to parse questions. Please check the format.");
    } finally {
      setIsParsing(false);
    }
  };

  const isDataLoading = isLoading || isLoadingSubTopic || isParsing;

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
            disabled={isDataLoading}
          >
            {showRawEditor ? "Show Formatted" : "Edit Raw Text"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onDiscardEvent}
            disabled={isDataLoading}
          >
            Discard
          </Button>
          <Button 
            onClick={onSaveQuestions}
            disabled={isDataLoading || editedQuestions.length === 0}
          >
            {isDataLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Save All Questions"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <EventDetails event={selectedEvent} />

        {isDataLoading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Processing...</p>
          </div>
        )}

        {showRawEditor ? (
          <div className="space-y-4">
            <Textarea 
              value={rawText} 
              onChange={(e) => setRawText(e.target.value)} 
              rows={15}
              placeholder="Paste your raw question text here..."
              className="font-mono text-sm"
              disabled={isParsing}
            />
            
            {parseError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end">
              <Button 
                onClick={handleParseRawText}
                disabled={isParsing || !rawText.trim()}
              >
                {isParsing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  "Parse Questions"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {editedQuestions.length > 0 ? (
              editedQuestions.map((question, index) => (
                <QuestionEditCard 
                  key={index}
                  question={question}
                  index={index}
                  category={category}
                  selectedSubTopicId={selectedEvent.payload.sub_topic_id}
                  onUpdateQuestion={(updatedQuestion) => onUpdateQuestion(index, updatedQuestion)}
                />
              ))
            ) : !isDataLoading && (
              <Alert>
                <AlertDescription>
                  No questions found. Try using the "Edit Raw Text" button to paste and parse question content.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
