
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Send } from "lucide-react";

interface NavigationButtonsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
  reviewMode: boolean;
  onExitReview?: () => void;
}

const NavigationButtons = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
  reviewMode,
  onExitReview
}: NavigationButtonsProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
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
  );
};

export default NavigationButtons;
