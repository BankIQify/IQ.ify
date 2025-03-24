
import React from 'react';
import type { QuestionContent } from '@/types/questions';

interface QuestionContentProps {
  content: QuestionContent;
}

export const QuestionContent = ({ content }: QuestionContentProps) => {
  // Function to safely render HTML content
  const renderHTML = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="space-y-4">
      {/* Question text - support for HTML content */}
      <div className="question-content">
        {content.question.includes('<table') || content.question.includes('<div') ? (
          <div dangerouslySetInnerHTML={renderHTML(content.question)} />
        ) : (
          <p>{content.question}</p>
        )}
      </div>
      
      {/* Question image */}
      {content.imageUrl && (
        <div className="my-3">
          <img 
            src={content.imageUrl} 
            alt="Question visual" 
            className="max-w-full h-auto rounded-lg border"
          />
        </div>
      )}
      
      {/* Standard multiple choice options */}
      {content.options && content.options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {content.options.map((option: string, i: number) => (
            <div
              key={i}
              className={`p-3 rounded-lg border ${
                option === content.correctAnswer
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              {option.includes('<') && option.includes('>') ? (
                <div dangerouslySetInnerHTML={renderHTML(option)} />
              ) : (
                option
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Dual choice options */}
      {content.primaryOptions && content.secondaryOptions && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Primary Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.primaryOptions.map((option: string, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    option === content.correctPrimaryAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {option.includes('<') && option.includes('>') ? (
                    <div dangerouslySetInnerHTML={renderHTML(option)} />
                  ) : (
                    option
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Secondary Options:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.secondaryOptions.map((option: string, i: number) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border ${
                    option === content.correctSecondaryAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {option.includes('<') && option.includes('>') ? (
                    <div dangerouslySetInnerHTML={renderHTML(option)} />
                  ) : (
                    option
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Answer image (if present) */}
      {content.answerImageUrl && (
        <div className="my-3">
          <p className="font-medium mb-2">Answer:</p>
          <img 
            src={content.answerImageUrl} 
            alt="Answer visual" 
            className="max-w-full h-auto rounded-lg border"
          />
        </div>
      )}
      
      {/* Explanation section - support for HTML content */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Explanation:</p>
        {content.explanation.includes('<table') || content.explanation.includes('<div') ? (
          <div dangerouslySetInnerHTML={renderHTML(content.explanation)} />
        ) : (
          <p>{content.explanation}</p>
        )}
      </div>
    </div>
  );
};
