
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { QuestionBasicFields } from "./question-edit/QuestionBasicFields";
import { QuestionItem } from "./types";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { QuestionTypeManager } from "./question-edit/QuestionTypeManager";
import { DifficultySelector } from "./question-edit/DifficultySelector";
import { SubTopicDisplay } from "./question-edit/SubTopicDisplay";
import { useQuestionEditState } from "./hooks/useQuestionEditState";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionItem) => void;
  onDeleteQuestion: (index: number) => void;
  category: string;
  selectedSubTopicId?: string;
}

export const QuestionEditCard = ({
  question,
  index,
  onUpdateQuestion,
  onDeleteQuestion,
  category,
  selectedSubTopicId
}: QuestionEditCardProps) => {
  const {
    questionState,
    handleQuestionChange,
    handleExplanationChange,
    handleDifficultyChange,
    handleOptionChange,
    handleCorrectAnswerChange
  } = useQuestionEditState(question);

  const handleUpdate = () => {
    onUpdateQuestion(index, questionState);
  };

  const handleDelete = () => {
    onDeleteQuestion(index);
  };

  const handleDuplicate = () => {
    onUpdateQuestion(index, questionState); // Save current changes first
    const duplicatedQuestion = { ...questionState };
    // Add the new question after the current one
    onUpdateQuestion(-1, duplicatedQuestion); // -1 indicates append
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Question #{index + 1}</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDuplicate}
              title="Duplicate Question"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              title="Delete Question"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Show the SubTopic display component */}
        <SubTopicDisplay subTopicId={questionState.subTopicId || selectedSubTopicId} />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <QuestionBasicFields 
          question={questionState.question}
          explanation={questionState.explanation}
          onQuestionChange={handleQuestionChange}
          onExplanationChange={handleExplanationChange}
        />
        
        {/* Add difficulty selector for brain training questions */}
        {category === 'brain_training' && (
          <DifficultySelector
            difficulty={questionState.difficulty || 'medium'}
            onChange={handleDifficultyChange}
          />
        )}
        
        <QuestionTypeManager
          questionState={questionState}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={handleCorrectAnswerChange}
        />
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleUpdate}
        >
          Update Question
        </Button>
      </CardFooter>
    </Card>
  );
};
