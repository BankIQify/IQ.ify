
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Edit, Trash2 } from "lucide-react";
import type { QuestionContent } from "@/types/questions";
import { QuestionWithDuplicateFlag } from "./utils/duplicationDetector";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose 
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditableQuestionsListProps {
  questions: Array<QuestionWithDuplicateFlag>;
  onQuestionDeleted?: () => void;
}

export const EditableQuestionsList = ({ questions, onQuestionDeleted }: EditableQuestionsListProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to safely render HTML content
  const renderHTML = (html: string) => {
    return { __html: html };
  };

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
      {questions.map((question, index) => {
        const content = question.content;
        return (
          <Card key={question.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  {question.hasSimilar && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Possible Duplicate</span>
                      {question.similarityScore && (
                        <span className="ml-1 text-xs">
                          ({(question.similarityScore * 100).toFixed(0)}% match)
                        </span>
                      )}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {question.sub_topics?.name}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditQuestion(question.id)}
                      title="Edit Question"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setQuestionToDelete(question.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete Question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Similarity Progress Bar */}
              {question.hasSimilar && question.similarityScore && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Similarity Score</span>
                    <span>{(question.similarityScore * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={question.similarityScore * 100} 
                    className={`h-2 ${
                      question.similarityScore > 0.9 ? "bg-red-100" : 
                      question.similarityScore > 0.8 ? "bg-orange-100" : "bg-yellow-100"
                    }`}
                  />
                  <div className="flex gap-2 mt-1">
                    {question.similarTo && question.similarTo.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Similar to: Question {questions.findIndex(q => q.id === question.similarTo?.[0]) + 1}
                        {question.similarTo.length > 1 && ` and ${question.similarTo.length - 1} more`}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Question text - support for HTML content */}
              <div className="question-content">
                {content.question.includes('<table') || content.question.includes('<div') ? (
                  <div dangerouslySetInnerHTML={renderHTML(content.question)} />
                ) : (
                  <p>{content.question}</p>
                )}
              </div>
              
              {/* Question image */}
              {content.imageUrl && (
                <div className="my-3">
                  <img 
                    src={content.imageUrl} 
                    alt="Question visual" 
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              
              {/* Standard multiple choice options */}
              {content.options && content.options.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {content.options.map((option: string, i: number) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        option === content.correctAnswer
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      {option.includes('<') && option.includes('>') ? (
                        <div dangerouslySetInnerHTML={renderHTML(option)} />
                      ) : (
                        option
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Dual choice options */}
              {content.primaryOptions && content.secondaryOptions && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Primary Options:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.primaryOptions.map((option: string, i: number) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            option === content.correctPrimaryAnswer
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option.includes('<') && option.includes('>') ? (
                            <div dangerouslySetInnerHTML={renderHTML(option)} />
                          ) : (
                            option
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Secondary Options:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {content.secondaryOptions.map((option: string, i: number) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg border ${
                            option === content.correctSecondaryAnswer
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          {option.includes('<') && option.includes('>') ? (
                            <div dangerouslySetInnerHTML={renderHTML(option)} />
                          ) : (
                            option
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Answer image (if present) */}
              {content.answerImageUrl && (
                <div className="my-3">
                  <p className="font-medium mb-2">Answer:</p>
                  <img 
                    src={content.answerImageUrl} 
                    alt="Answer visual" 
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}
              
              {/* Explanation section - support for HTML content */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Explanation:</p>
                {content.explanation.includes('<table') || content.explanation.includes('<div') ? (
                  <div dangerouslySetInnerHTML={renderHTML(content.explanation)} />
                ) : (
                  <p>{content.explanation}</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}

      {/* Confirmation Dialog for Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this question? This action cannot be undone.</p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => questionToDelete && handleDeleteQuestion(questionToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
