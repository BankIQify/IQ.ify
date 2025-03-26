
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, X } from "lucide-react";
import { Question } from "@/types/exam";

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
  if (!question || !question.content) {
    console.error('Invalid question data:', question);
    return (
      <Card className="p-6 mb-6">
        <div className="text-center py-4">
          <p className="text-red-500">Error: Question data is invalid or incomplete</p>
        </div>
      </Card>
    );
  }

  console.log('Rendering question:', question.id, question.content.question);
  
  // Ensure we're comparing values of the same type
  const correctAnswer = question.content.answer;
  const isCorrect = 
    typeof currentAnswerId === 'number' && typeof correctAnswer === 'number'
      ? currentAnswerId === correctAnswer
      : String(currentAnswerId) === String(correctAnswer);
  
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {question.content.question}
      </h2>
      
      {question.content.options && (
        <div className="space-y-3">
          {question.content.options.map((option, index) => {
            const isSelected = currentAnswerId === index;
            const isCorrectAnswer = correctAnswer === index;
            
            // Determine the styling based on the state
            let className = "flex items-center p-3 rounded-md cursor-pointer transition-colors ";
            
            // Enhanced styling for review mode
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
                aria-selected={isSelected}
                role="option"
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
      
      {reviewMode && examCompleted && currentAnswerId !== undefined && (
        <div className="mt-4 pt-4 border-t">
          <p className={isCorrect ? "text-green-600" : "text-red-600"}>
            {isCorrect 
              ? "Correct answer! 👍" 
              : `Incorrect. The correct answer is: ${
                  question.content.options 
                    ? question.content.options[typeof correctAnswer === 'number' ? correctAnswer : Number(correctAnswer)]
                    : correctAnswer
                }`
            }
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
