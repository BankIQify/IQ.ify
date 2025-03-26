
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

  // Log the question for debugging
  console.log('Processing question in QuestionDisplay:', question);

  // Determine correct answer - first try answer directly, fall back to correctAnswer
  const correctAnswer = question.content.answer !== undefined 
    ? question.content.answer 
    : question.content.correctAnswer !== undefined 
      ? question.content.correctAnswer 
      : undefined;

  if (correctAnswer === undefined) {
    console.error('No correct answer found in question:', question);
    return (
      <Card className="p-6 mb-6">
        <div className="text-center py-4">
          <p className="text-red-500">Error: No correct answer found for this question</p>
        </div>
      </Card>
    );
  }
  
  // Ensure we're comparing values of the same type
  const isCorrect = 
    typeof currentAnswerId === 'number' && typeof correctAnswer === 'number'
      ? currentAnswerId === correctAnswer
      : String(currentAnswerId) === String(correctAnswer);
  
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {question.content.question}
      </h2>
      
      {question.content.options && Array.isArray(question.content.options) && question.content.options.length > 0 ? (
        <div className="space-y-3">
          {question.content.options.map((option, index) => {
            const isSelected = currentAnswerId === index;
            const isCorrectAnswer = 
              correctAnswer === index || 
              correctAnswer === option ||
              (typeof correctAnswer === 'string' && option === correctAnswer);
            
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
                onClick={() => {
                  if (!examCompleted || reviewMode) {
                    onSelectAnswer(index);
                  }
                }}
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
      ) : (
        <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-yellow-700">This question has no options. This is likely a data issue.</p>
        </div>
      )}
      
      {reviewMode && examCompleted && currentAnswerId !== undefined && (
        <div className="mt-4 pt-4 border-t">
          <p className={isCorrect ? "text-green-600" : "text-red-600"}>
            {isCorrect 
              ? "Correct answer! 👍" 
              : `Incorrect. The correct answer is: ${
                  question.content.options && Array.isArray(question.content.options) && question.content.options.length > 0
                    ? question.content.options[typeof correctAnswer === 'number' ? correctAnswer : Number(correctAnswer)] || String(correctAnswer)
                    : String(correctAnswer)
                }`
            }
          </p>
          
          {/* Always show explanation in review mode */}
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Explanation:</h3>
            <p className="text-gray-600">
              {question.content.explanation 
                ? question.content.explanation 
                : "Understanding this question type helps build your reasoning skills. Practice similar questions to improve."}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
