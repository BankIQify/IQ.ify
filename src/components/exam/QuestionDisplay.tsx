
import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, X, Sparkles, Award } from "lucide-react";
import { Question } from "@/types/exam";
import { cn } from "@/lib/utils";

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
    <Card className="p-6 mb-6 border-2 border-pastel-blue rounded-xl bg-white shadow-lg overflow-hidden animate-fadeIn">
      <h2 className="text-xl font-bold mb-5 text-iqify-navy bg-pastel-blue/20 p-3 rounded-lg">
        {question.content.question}
      </h2>
      
      {question.content.options && (
        <div className="space-y-4">
          {question.content.options.map((option, index) => {
            const isSelected = 
              typeof currentAnswerId === 'number' && typeof index === 'number'
                ? currentAnswerId === index
                : String(currentAnswerId) === String(index);
                
            const isCorrectAnswer = 
              typeof correctAnswer === 'number' && typeof index === 'number'
                ? correctAnswer === index
                : String(correctAnswer) === String(index);
            
            // Enhanced child-friendly styling
            let className = "flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ";
            
            // Enhanced styling for review mode with playful elements
            if (reviewMode && examCompleted) {
              if (isCorrectAnswer) {
                className += "bg-green-50 border-green-400 shadow-md transform hover:scale-102 ";
              } else if (isSelected && !isCorrectAnswer) {
                className += "bg-red-50 border-red-300 ";
              } else {
                className += "hover:bg-gray-50 border-gray-200 hover:border-gray-300 ";
              }
            } else {
              className += isSelected 
                ? "bg-primary/10 border-primary shadow-md transform hover:scale-102 " 
                : "hover:bg-gray-50 border-gray-200 hover:border-primary/30 ";
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
                    <div className="flex items-center justify-center bg-green-100 rounded-full p-1 mr-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  ) : isSelected ? (
                    <div className="flex items-center justify-center bg-red-100 rounded-full p-1 mr-4">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 mr-4">
                      <Circle className="w-6 h-6 text-gray-400" />
                    </div>
                  )
                ) : (
                  isSelected ? (
                    <div className="flex items-center justify-center bg-primary/20 rounded-full p-1 mr-4">
                      <CheckCircle className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 mr-4">
                      <Circle className="w-6 h-6 text-gray-400" />
                    </div>
                  )
                )}
                <span className={cn(
                  "font-medium",
                  (reviewMode && examCompleted && isCorrectAnswer) && "text-green-600",
                  (reviewMode && examCompleted && isSelected && !isCorrectAnswer) && "text-red-600"
                )}>{option}</span>
              </div>
            );
          })}
        </div>
      )}
      
      {reviewMode && examCompleted && currentAnswerId !== undefined && (
        <div className="mt-6 pt-5 border-t-2 border-dashed border-pastel-purple/30">
          <div className={cn(
            "p-4 rounded-lg flex items-start gap-3",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            {isCorrect ? (
              <>
                <Sparkles className="w-6 h-6 text-green-500 mt-0.5" />
                <div>
                  <p className="text-green-600 font-semibold">
                    Great job! That's correct! 👍
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    Keep up the good work!
                  </p>
                </div>
              </>
            ) : (
              <>
                <Award className="w-6 h-6 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-red-600 font-semibold">
                    Oops! Not quite right.
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    The correct answer is: <span className="font-medium">{getCorrectOptionText()}</span>
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Don't worry - learning happens when we make mistakes!
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
