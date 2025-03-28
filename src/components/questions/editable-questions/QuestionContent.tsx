
import React from 'react';
import type { QuestionContent as QuestionContentType } from "@/types/questions";

interface QuestionContentProps {
  content: QuestionContentType;
}

export const QuestionContent: React.FC<QuestionContentProps> = ({ content }) => {
  // Display options if they exist
  const hasOptions = content.options && content.options.length > 0;
  
  return (
    <div className="space-y-2">
      <div className="text-base font-medium">{content.question}</div>
      
      {hasOptions && (
        <div className="grid gap-2">
          {content.options.map((option, index) => (
            <div 
              key={index} 
              className={`p-2 border rounded ${option === content.correctAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            >
              {option}
              {option === content.correctAnswer && (
                <span className="ml-2 text-green-600 text-sm">(Correct)</span>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* For dual choice questions */}
      {content.primaryOptions && content.secondaryOptions && (
        <div className="space-y-4">
          <div className="grid gap-2">
            <h4 className="font-medium">Primary Options:</h4>
            {content.primaryOptions.map((option, index) => (
              <div 
                key={index} 
                className={`p-2 border rounded ${option === content.correctPrimaryAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                {option}
                {option === content.correctPrimaryAnswer && (
                  <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="grid gap-2">
            <h4 className="font-medium">Secondary Options:</h4>
            {content.secondaryOptions.map((option, index) => (
              <div 
                key={index} 
                className={`p-2 border rounded ${option === content.correctSecondaryAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                {option}
                {option === content.correctSecondaryAnswer && (
                  <span className="ml-2 text-green-600 text-sm">(Correct)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Explanation */}
      {content.explanation && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded">
          <h4 className="font-medium">Explanation:</h4>
          <p className="text-sm">{content.explanation}</p>
        </div>
      )}
    </div>
  );
};
