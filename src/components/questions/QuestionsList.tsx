
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import type { QuestionContent } from "@/types/questions";
import { QuestionWithDuplicateFlag } from "./utils/duplicationDetector";

interface QuestionsListProps {
  questions: Array<QuestionWithDuplicateFlag>;
}

export const QuestionsList = ({ questions }: QuestionsListProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Generated Questions</h2>
      {questions.map((question, index) => {
        const content = question.content;
        return (
          <Card key={question.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  {question.hasSimilar && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Possible Duplicate</span>
                      {question.similarityScore && (
                        <span className="ml-1 text-xs">
                          ({(question.similarityScore * 100).toFixed(0)}% match)
                        </span>
                      )}
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {question.sub_topics?.name}
                </span>
              </div>
              
              {/* Similarity Progress Bar */}
              {question.hasSimilar && question.similarityScore && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Similarity Score</span>
                    <span>{(question.similarityScore * 100).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={question.similarityScore * 100} 
                    className={`h-2 ${
                      question.similarityScore > 0.9 ? "bg-red-100" : 
                      question.similarityScore > 0.8 ? "bg-orange-100" : "bg-yellow-100"
                    }`}
                  />
                  <div className="flex gap-2 mt-1">
                    {question.similarTo && question.similarTo.length > 0 && (
                      <div className="text-xs text-gray-500">
                        Similar to: Question {questions.findIndex(q => q.id === question.similarTo?.[0]) + 1}
                        {question.similarTo.length > 1 && ` and ${question.similarTo.length - 1} more`}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Question text */}
              <p>{content.question}</p>
              
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
                      {option}
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
                          {option}
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
                          {option}
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
              
              {/* Explanation section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Explanation:</p>
                <p>{content.explanation}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
