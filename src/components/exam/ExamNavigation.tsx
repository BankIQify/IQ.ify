
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
  reviewMode?: boolean;
  onExitReview?: () => void;
  onJumpToQuestion?: (index: number) => void;
}

const ExamNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
  reviewMode = false,
  onExitReview,
  onJumpToQuestion
}: ExamNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process keyboard shortcuts if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
          if (currentQuestionIndex > 0) {
            onPrevious();
          }
          break;
        case "ArrowRight":
          if (!isLastQuestion) {
            onNext();
          }
          break;
        case "Enter":
          if (e.ctrlKey && isLastQuestion && !reviewMode) {
            onSubmit();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentQuestionIndex, isLastQuestion, onNext, onPrevious, onSubmit, reviewMode]);

  // Create pagination items
  const renderPaginationItems = () => {
    // For smaller exams, show all page numbers
    if (totalQuestions <= 10) {
      return Array.from({ length: totalQuestions }).map((_, index) => (
        <PaginationItem key={index}>
          <PaginationLink 
            isActive={currentQuestionIndex === index}
            onClick={() => onJumpToQuestion && onJumpToQuestion(index)}
            className="cursor-pointer"
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }
    
    // For larger exams, show a subset with ellipsis
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={currentQuestionIndex === 0}
          onClick={() => onJumpToQuestion && onJumpToQuestion(0)}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Determine range around current page
    let startPage = Math.max(1, currentQuestionIndex - 1);
    let endPage = Math.min(totalQuestions - 2, currentQuestionIndex + 1);
    
    // Add ellipsis if needed before current range
    if (startPage > 1) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationLink className="cursor-pointer" onClick={() => onJumpToQuestion && onJumpToQuestion(Math.floor(startPage / 2))}>
            ...
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentQuestionIndex === i}
            onClick={() => onJumpToQuestion && onJumpToQuestion(i)}
            className="cursor-pointer"
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if needed after current range
    if (endPage < totalQuestions - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationLink className="cursor-pointer" onClick={() => onJumpToQuestion && onJumpToQuestion(Math.floor((endPage + totalQuestions - 1) / 2))}>
            ...
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Always show last page
    items.push(
      <PaginationItem key="last">
        <PaginationLink 
          isActive={currentQuestionIndex === totalQuestions - 1}
          onClick={() => onJumpToQuestion && onJumpToQuestion(totalQuestions - 1)}
          className="cursor-pointer"
        >
          {totalQuestions}
        </PaginationLink>
      </PaginationItem>
    );
    
    return items;
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{progressPercentage}% completed</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
      
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {renderPaginationItems()}
        </PaginationContent>
      </Pagination>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="flex space-x-3">
          {reviewMode && onExitReview && (
            <Button 
              variant="secondary" 
              onClick={onExitReview}
            >
              Return to Results
            </Button>
          )}
          
          {!reviewMode && isLastQuestion && (
            <Button 
              onClick={onSubmit} 
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Exam</span>
                </>
              )}
            </Button>
          )}
          
          <Button 
            onClick={onNext}
            disabled={isLastQuestion}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>Keyboard shortcuts: <span className="bg-gray-100 px-1 rounded">←</span> Previous | <span className="bg-gray-100 px-1 rounded">→</span> Next {!reviewMode && isLastQuestion && '| <span className="bg-gray-100 px-1 rounded">Ctrl+Enter</span> Submit'}</p>
      </div>
    </div>
  );
};

export default ExamNavigation;
