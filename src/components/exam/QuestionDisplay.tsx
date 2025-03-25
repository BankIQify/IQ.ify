
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, X } from "lucide-react";
import { Question } from "@/hooks/useExam";

interface QuestionDisplayProps {
  question: Question;
  currentAnswerId: string | number | undefined;
  examCompleted: boolean;
  onSelectAnswer: (answerId: string | number) => void;
  reviewMode?: boolean;
}

const QuestionDisplay = ({ 
  question, 
  currentAnswerId, 
  examCompleted, 
  onSelectAnswer,
  reviewMode = false
}: QuestionDisplayProps) => {
  const isCorrect = currentAnswerId === question.content.answer;
  
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {question.content.question}
      </h2>
      
      {question.content.options && (
        <div className="space-y-3">
          {question.content.options.map((option, index) => {
            const isSelected = currentAnswerId === index;
            const isCorrectAnswer = question.content.answer === index;
            
            let className = "flex items-center p-3 rounded-md cursor-pointer transition-colors ";
            
            if (reviewMode && examCompleted) {
              if (isCorrectAnswer) {
                className += "bg-green-100 border border-green-500 ";
              } else if (isSelected && !isCorrectAnswer) {
                className += "bg-red-100 border border-red-500 ";
              } else {
                className += "hover:bg-gray-100 border border-gray-200 ";
              }
            } else {
              className += isSelected 
                ? "bg-primary/10 border border-primary " 
                : "hover:bg-gray-100 border border-gray-200 ";
            }
            
            return (
              <div 
                key={index}
                onClick={() => onSelectAnswer(index)}
                className={className}
              >
                {reviewMode && examCompleted ? (
                  isCorrectAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  ) : isSelected ? (
                    <X className="w-5 h-5 text-red-500 mr-3" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mr-3" />
                  )
                ) : (
                  isSelected ? (
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mr-3" />
                  )
                )}
                <span>{option}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
