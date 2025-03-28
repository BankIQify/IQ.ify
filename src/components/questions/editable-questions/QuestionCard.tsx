
import React from 'react';
import { Card } from "@/components/ui/card";
import { QuestionWithDuplicateFlag } from "../utils/duplicationDetector";
import { QuestionHeader } from './QuestionHeader';
import { QuestionContent } from './QuestionContent';

interface QuestionCardProps {
  question: QuestionWithDuplicateFlag;
  index: number;
  questions: Array<QuestionWithDuplicateFlag>;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuestionCard = ({ 
  question, 
  index, 
  questions, 
  onEdit, 
  onDelete 
}: QuestionCardProps) => {
  const content = question.content;
  
  return (
    <Card key={question.id} className="p-6">
      <div className="space-y-4">
        <QuestionHeader 
          question={question} 
          index={index} 
          questions={questions} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
        <QuestionContent content={content} />
      </div>
    </Card>
  );
};
