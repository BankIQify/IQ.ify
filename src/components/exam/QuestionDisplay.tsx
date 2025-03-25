
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle } from "lucide-react";
import { Question } from "@/hooks/useExam";

interface QuestionDisplayProps {
  question: Question;
  currentAnswerId: string | number | undefined;
  examCompleted: boolean;
  onSelectAnswer: (answerId: string | number) => void;
}

const QuestionDisplay = ({ 
  question, 
  currentAnswerId, 
  examCompleted, 
  onSelectAnswer 
}: QuestionDisplayProps) => {
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {question.content.question}
      </h2>
      
      {question.content.options && (
        <div className="space-y-3">
          {question.content.options.map((option, index) => (
            <div 
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                currentAnswerId === index 
                  ? 'bg-primary/10 border border-primary' 
                  : 'hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {currentAnswerId === index ? (
                <CheckCircle className="w-5 h-5 text-primary mr-3" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 mr-3" />
              )}
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
