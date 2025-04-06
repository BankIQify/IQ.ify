import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";

interface QuestionHeaderProps {
  question: QuestionWithDuplicateFlag;
  index: number;
  questions: Array<QuestionWithDuplicateFlag>;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuestionHeader = ({ 
  question, 
  index, 
  questions, 
  onEdit, 
  onDelete 
}: QuestionHeaderProps) => {
  // Get the category (subject) from the question's sub_topics
  const category = question.sub_topics?.[0]?.question_sections?.[0]?.category;
  const subTopicName = question.sub_topics?.[0]?.name;

  // Format category for display
  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
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
          <div className="flex items-center gap-2 text-sm">
            {category && (
              <Badge variant="secondary" className="font-normal">
                {formatCategory(category)}
              </Badge>
            )}
            {subTopicName && (
              <Badge variant="outline" className="font-normal">
                {subTopicName}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(question.id)}
            title="Edit Question"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(question.id)}
            title="Delete Question"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Similarity Progress Bar */}
      {question.hasSimilar && question.similarityScore && (
        <div>
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
    </div>
  );
};
