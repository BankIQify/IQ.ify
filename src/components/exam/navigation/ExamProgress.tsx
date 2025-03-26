
import { Progress } from "@/components/ui/progress";

interface ExamProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const ExamProgress = ({ currentQuestionIndex, totalQuestions }: ExamProgressProps) => {
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-sm text-gray-500">
        <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <span>{progressPercentage}% completed</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default ExamProgress;
