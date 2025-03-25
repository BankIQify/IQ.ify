
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
  // Ensure we're comparing values of the same type
  const correctAnswer = question.content.answer;
  const isCorrect = 
    typeof currentAnswerId === 'number' && typeof correctAnswer === 'number'
      ? currentAnswerId === correctAnswer
      : String(currentAnswerId) === String(correctAnswer);
  
  // Function to safely get the correct option text
  const getCorrectOptionText = () => {
    if (!question.content.options) return correctAnswer;
    
    // Convert index to number if it's a string
    const index = typeof correctAnswer === 'number' 
      ? correctAnswer 
      : parseInt(String(correctAnswer), 10);
    
    // Ensure index is valid
    if (isNaN(index) || index < 0 || index >= question.content.options.length) {
      return correctAnswer;
    }
    
    return question.content.options[index];
  };
  
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {question.content.question}
      </h2>
      
      {question.content.options && (
        <div className="space-y-3">
          {question.content.options.map((option, index) => {
            const isSelected = 
              typeof currentAnswerId === 'number' && typeof index === 'number'
                ? currentAnswerId === index
                : String(currentAnswerId) === String(index);
                
            const isCorrectAnswer = 
              typeof correctAnswer === 'number' && typeof index === 'number'
                ? correctAnswer === index
                : String(correctAnswer) === String(index);
            
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
              : `Incorrect. The correct answer is: ${getCorrectOptionText()}`
            }
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
