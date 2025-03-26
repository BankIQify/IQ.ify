
import { useEffect } from "react";
import ExamProgress from "./navigation/ExamProgress";
import ExamPagination from "./navigation/ExamPagination";
import NavigationButtons from "./navigation/NavigationButtons";
import KeyboardShortcutsHelp from "./navigation/KeyboardShortcutsHelp";

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

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <ExamProgress 
        currentQuestionIndex={currentQuestionIndex} 
        totalQuestions={totalQuestions} 
      />
      
      {/* Pagination */}
      {onJumpToQuestion && (
        <ExamPagination 
          currentQuestionIndex={currentQuestionIndex} 
          totalQuestions={totalQuestions} 
          onJumpToQuestion={onJumpToQuestion} 
        />
      )}
      
      {/* Navigation buttons */}
      <NavigationButtons 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
        submitting={submitting}
        reviewMode={reviewMode}
        onExitReview={onExitReview}
      />
      
      {/* Keyboard shortcuts help */}
      <KeyboardShortcutsHelp 
        isLastQuestion={isLastQuestion} 
        reviewMode={reviewMode} 
      />
    </div>
  );
};

export default ExamNavigation;
