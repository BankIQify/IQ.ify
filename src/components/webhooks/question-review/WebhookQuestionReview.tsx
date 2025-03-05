
import { EventsList } from "./EventsList";
import { QuestionEditor } from "./QuestionEditor";
import { QuestionsPreview } from "./QuestionsPreview";
import { NoSelectionView } from "./NoSelectionView";
import { useWebhookQuestions } from "./useWebhookQuestions";

export const WebhookQuestionReview = () => {
  const {
    webhookEvents,
    isLoading,
    selectedEvent,
    editedQuestions,
    handleSelectEvent,
    handleUpdateQuestion,
    handleSaveQuestions,
    handleDiscardEvent,
  } = useWebhookQuestions();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <EventsList 
            webhookEvents={webhookEvents}
            isLoading={isLoading}
            selectedEventId={selectedEvent?.id || null}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        <div className="md:col-span-2">
          {selectedEvent ? (
            <div className="space-y-4">
              <QuestionEditor
                selectedEvent={selectedEvent}
                editedQuestions={editedQuestions}
                isLoading={isLoading}
                onUpdateQuestion={handleUpdateQuestion}
                onSaveQuestions={handleSaveQuestions}
                onDiscardEvent={handleDiscardEvent}
              />

              <QuestionsPreview
                selectedEvent={selectedEvent}
                editedQuestions={editedQuestions}
              />
            </div>
          ) : (
            <NoSelectionView />
          )}
        </div>
      </div>
    </div>
  );
};
