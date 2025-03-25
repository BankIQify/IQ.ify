
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ExamCompletedProps {
  examName: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  onReviewAnswers: () => void;
}

const ExamCompleted = ({
  examName,
  score,
  totalQuestions,
  answeredQuestions,
  onReviewAnswers
}: ExamCompletedProps) => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/practice")} className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Practice
        </Button>
        <h1 className="section-title">Exam Completed</h1>
      </div>
      
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">{examName}</h2>
        <div className="mb-6 mt-4">
          <p className="text-5xl font-bold text-primary mb-2">{score}%</p>
          <p className="text-gray-600">
            You answered {answeredQuestions} out of {totalQuestions} questions
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/practice")}>Return to Practice</Button>
          <Button variant="outline" onClick={onReviewAnswers}>
            Review Answers
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExamCompleted;
