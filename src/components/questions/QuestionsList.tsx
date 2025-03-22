
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              <p>{content.question}</p>
              {content.imageUrl && (
                <img 
                  src={content.imageUrl} 
                  alt="Question" 
                  className="max-w-full h-auto rounded-lg"
                />
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
