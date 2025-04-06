import { Card } from "@/components/ui/card";
import { CheckCircle, Circle, X, AlertTriangle } from "lucide-react";
import { Question } from "@/types/exam";

interface QuestionDisplayProps {
  question: Question;
  currentAnswerId: string | number | undefined;
  examCompleted: boolean;
  onSelectAnswer: (answerId: string | number) => void;
  reviewMode?: boolean;
  examType?: 'custom' | 'practice';
}

const QuestionDisplay = ({ 
  question, 
  currentAnswerId, 
  examCompleted, 
  onSelectAnswer,
  reviewMode = false,
  examType = 'practice'
}: QuestionDisplayProps) => {
  // Validate question data
  if (!question) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-center py-8 text-red-500">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <p>Error: Question data is missing</p>
        </div>
      </Card>
    );
  }

  // Validate content
  if (!question.content || typeof question.content !== 'object') {
    console.error('Invalid question content:', question);
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-center py-8 text-red-500">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <p>Error: Question content is invalid</p>
        </div>
      </Card>
    );
  }

  // Log the question for debugging
  console.log('Processing question in QuestionDisplay:', question.id, question.content);
  console.log('Question sub_topic_id:', question.sub_topic_id);
  console.log('Question sub_topic_name:', question.sub_topic_name);

  // Get question text, handling different possible formats
  const questionText = question.content.question || 
                      (typeof question.content === 'string' ? question.content : 'Question text unavailable');

  // Get options, handling different possible formats
  const options = question.content.options || [];
  
  if (options.length === 0) {
    console.warn('No options found for question:', question.id);
  }
  
  // Determine correct answer - with improved fallback logic
  const correctAnswer = 
    question.content.answer !== undefined ? question.content.answer : 
    question.content.correctAnswer !== undefined ? question.content.correctAnswer : 
    undefined;

  if (correctAnswer === undefined && examCompleted && reviewMode) {
    console.error('No correct answer found in question:', question);
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-center py-8 text-yellow-500">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <p>Error: This question has no correct answer defined.</p>
        </div>
      </Card>
    );
  }
  
  // Ensure we're comparing values of the same type
  const isCorrect = (currentAnswerId !== undefined && correctAnswer !== undefined) && (
    typeof currentAnswerId === 'number' && typeof correctAnswer === 'number'
      ? currentAnswerId === correctAnswer
      : String(currentAnswerId) === String(correctAnswer)
  );

  // Determine if we should show the explanation
  const shouldShowExplanation = (
    // For custom exams, show explanation immediately after answering if incorrect
    (examType === 'custom' && currentAnswerId !== undefined && !isCorrect) ||
    // For practice exams, only show explanation in review mode and if incorrect
    (examType === 'practice' && reviewMode && currentAnswerId !== undefined && !isCorrect)
  );
  
  return (
    <Card className="p-6 mb-6 animate-fade-in">
      {/* Add sub-topic name if available */}
      {question.sub_topic_name && (
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {question.sub_topic_name}
          </span>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">
        {questionText}
      </h2>
      
      {options && Array.isArray(options) && options.length > 0 ? (
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = 
              currentAnswerId === index || 
              (typeof currentAnswerId === 'string' && currentAnswerId === option);
            
            const isCorrectAnswer = 
              correctAnswer === index || 
              correctAnswer === option ||
              (typeof correctAnswer === 'string' && option === correctAnswer);
            
            // Determine if we should show answer feedback
            const showAnswerFeedback = examType === 'custom' ? isSelected : reviewMode;
            
            // Determine the styling based on the state
            let className = "flex items-center p-3 rounded-md cursor-pointer transition-colors ";
            
            if (showAnswerFeedback) {
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
                {showAnswerFeedback ? (
                  isCorrectAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  ) : isSelected ? (
                    <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  )
                ) : (
                  isSelected ? (
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  )
                )}
                <span className="break-words">{option}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
          <p className="text-yellow-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            This question has no options. This is likely a data issue.
          </p>
        </div>
      )}
      
      {/* Show answer feedback for custom exams immediately after answering */}
      {examType === 'custom' && currentAnswerId !== undefined && (
        <div className="mt-6 pt-4 border-t">
          <p className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {isCorrect 
              ? "Correct answer! 👍" 
              : `Incorrect. The correct answer is: ${
                  options && Array.isArray(options) && options.length > 0 && typeof correctAnswer === 'number'
                    ? options[correctAnswer] || String(correctAnswer)
                    : String(correctAnswer)
                }`
            }
          </p>
        </div>
      )}
      
      {/* Show explanation based on the rules */}
      {shouldShowExplanation && (
        <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Explanation:</h3>
          <p className="text-gray-600">
            {question.content.explanation || 'Understanding this question type helps build your reasoning skills. Practice similar questions to improve.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;
