
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExamHeaderProps {
  examName: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  timeLimit?: number;
}

const ExamHeader = ({
  examName,
  currentQuestionNumber,
  totalQuestions,
  timeLimit
}: ExamHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="section-title">{examName}</h1>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm font-medium">
          Question {currentQuestionNumber} of {totalQuestions}
        </p>
        {timeLimit && (
          <p className="text-sm font-medium">
            Time Limit: {timeLimit} minutes
          </p>
        )}
      </div>
    </>
  );
};

export default ExamHeader;
