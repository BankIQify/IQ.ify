
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

const ExamNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  submitting
}: ExamNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </Button>
      
      <div className="flex space-x-3">
        {isLastQuestion && (
          <Button 
            onClick={onSubmit} 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Exam'
            )}
          </Button>
        )}
        
        <Button 
          onClick={onNext}
          disabled={isLastQuestion}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ExamNavigation;
