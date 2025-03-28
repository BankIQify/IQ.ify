<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart } from "lucide-react";

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
        
<<<<<<< HEAD
=======
        <div className="mt-4 mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
          <p>This exam will not be saved. You can review your answers now, but once you leave this page, all exam data will be permanently discarded.</p>
        </div>
        
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/practice")}>Return to Practice</Button>
          <Button variant="outline" onClick={onReviewAnswers}>
            Review Answers
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")} className="flex items-center">
            <BarChart className="w-4 h-4 mr-2" />
            View Progress
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ExamCompleted;
