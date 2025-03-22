
import { Card, CardContent } from "@/components/ui/card";
import { EventDetails } from "./EventDetails";
import { WebhookEvent, QuestionItem } from "./types";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuestionParser } from "./hooks/useQuestionParser";
import { EditorHeader } from "./question-edit/EditorHeader";
import { RawTextEditor } from "./question-edit/RawTextEditor";
import { FormattedQuestionsView } from "./question-edit/FormattedQuestionsView";

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
  
  const {
    rawText,
    parseError,
    isParsing,
    handleRawTextChange,
    handleParseRawText,
    handleParseIndividualSelections
  } = useQuestionParser(selectedEvent.payload.sub_topic_id, onSetQuestions);
  
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
  const isDataLoading = isLoading || isLoadingSubTopic || isParsing;

  const handleToggleEditorView = () => {
    setShowRawEditor(!showRawEditor);
    
    // Initialize raw text from the event payload if available
    if (!showRawEditor && selectedEvent.payload.raw_text) {
      handleRawTextChange(selectedEvent.payload.raw_text);
    }
  };

  return (
    <Card>
      <EditorHeader 
        showRawEditor={showRawEditor}
        onToggleEditorView={handleToggleEditorView}
        onDiscardEvent={onDiscardEvent}
        onSaveQuestions={onSaveQuestions}
        isLoading={isDataLoading}
        hasQuestions={editedQuestions.length > 0}
      />
      
      <CardContent className="space-y-4">
        <EventDetails event={selectedEvent} />

        {isDataLoading && (
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Processing...</p>
          </div>
        )}

        {showRawEditor ? (
          <RawTextEditor 
            rawText={rawText}
            onRawTextChange={handleRawTextChange}
            onParseQuestions={handleParseRawText}
            parseError={parseError}
            isParsing={isParsing}
          />
        ) : (
          <FormattedQuestionsView 
            questions={editedQuestions}
            category={category}
            selectedSubTopicId={selectedEvent.payload.sub_topic_id}
            onUpdateQuestion={onUpdateQuestion}
            isLoading={isDataLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};
