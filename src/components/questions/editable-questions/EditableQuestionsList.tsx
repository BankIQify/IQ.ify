
import React, { useState } from "react";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from './QuestionCard';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface EditableQuestionsListProps {
  questions: Array<QuestionWithDuplicateFlag>;
  onQuestionDeleted?: () => void;
}

export const EditableQuestionsList = ({ questions, onQuestionDeleted }: EditableQuestionsListProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteQuestion = async (id: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Question deleted",
        description: "The question has been successfully deleted."
      });

      // Close the dialog and refresh the list
      setDeleteDialogOpen(false);
      if (onQuestionDeleted) onQuestionDeleted();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Error",
        description: "Failed to delete the question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditQuestion = (questionId: string) => {
    // Navigate to webhook question review with the question ID
    // This approach relies on the existing webhook question review component
    const eventIdParam = new URLSearchParams({ questionId }).toString();
    window.open(`/manage-questions?tab=webhooks&${eventIdParam}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Question Bank</h2>
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={index}
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={(id) => {
            setQuestionToDelete(id);
            setDeleteDialogOpen(true);
          }}
        />
      ))}

      {/* Confirmation Dialog for Delete */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => questionToDelete && handleDeleteQuestion(questionToDelete)}
        isDeleting={isDeleting}
      />
    </div>
  );
};
