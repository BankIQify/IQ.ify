
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionItem } from "./types";
import {
  QuestionBasicFields,
  QuestionTypeSelector,
  MultipleChoiceEditor,
  DualChoiceEditor,
  TextAnswerEditor,
  DifficultySelector
} from "./question-edit";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onUpdateQuestion: (updatedQuestion: QuestionItem) => void;
  category?: string;
  selectedSubTopicId?: string;
}

export const QuestionEditCard = ({ 
  question, 
  index, 
  onUpdateQuestion, 
  category = "verbal",
  selectedSubTopicId 
}: QuestionEditCardProps) => {
  const [editedQuestion, setEditedQuestion] = useState<QuestionItem>(question);

  useEffect(() => {
    if (selectedSubTopicId && !editedQuestion.subTopicId) {
      handleChange("subTopicId", selectedSubTopicId);
    }
  }, [selectedSubTopicId]);

  const handleChange = (field: keyof QuestionItem, value: string) => {
    setEditedQuestion((prev) => {
      const updated = { ...prev, [field]: value };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.options) {
      const options = Array(4).fill("");
      setEditedQuestion((prev) => {
        const updated = { ...prev, options };
        onUpdateQuestion(updated);
        return updated;
      });
      return;
    }
    
    const newOptions = [...editedQuestion.options];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, options: newOptions };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const handlePrimaryOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.primaryOptions) return;
    
    const newOptions = [...editedQuestion.primaryOptions];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, primaryOptions: newOptions };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const handleSecondaryOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.secondaryOptions) return;
    
    const newOptions = [...editedQuestion.secondaryOptions];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, secondaryOptions: newOptions };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const addOption = () => {
    if (!editedQuestion.options) {
      setEditedQuestion((prev) => {
        const updated = { ...prev, options: [""] };
        onUpdateQuestion(updated);
        return updated;
      });
      return;
    }
    
    setEditedQuestion((prev) => {
      const newOptions = [...prev.options!, ""];
      const updated = { ...prev, options: newOptions };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const removeOption = (optionIndex: number) => {
    if (!editedQuestion.options || editedQuestion.options.length <= 1) return;
    
    setEditedQuestion((prev) => {
      const newOptions = prev.options!.filter((_, i) => i !== optionIndex);
      
      const correctAnswer = prev.correctAnswer;
      const removedOption = prev.options![optionIndex];
      const updated = { 
        ...prev, 
        options: newOptions,
        correctAnswer: correctAnswer === removedOption ? "" : correctAnswer 
      };
      
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const convertToTextAnswer = () => {
    setEditedQuestion((prev) => {
      const { options, ...rest } = prev;
      const updated = { 
        ...rest, 
        correctAnswer: rest.correctAnswer || "" 
      };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const addInitialOptions = () => {
    setEditedQuestion((prev) => {
      const initialOptions = ["", "", "", ""];
      const updated = { 
        ...prev, 
        options: initialOptions,
        correctAnswer: ""
      };
      
      if (updated.hasOwnProperty('correctAnswer') && !Array.isArray(updated.options)) {
        updated.correctAnswer = "";
      }
      
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const isDualChoice = !!editedQuestion.primaryOptions && !!editedQuestion.secondaryOptions;
  const shouldShowDifficulty = category === "brain_training";

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4">
        <QuestionBasicFields
          question={editedQuestion.question || ""}
          explanation={editedQuestion.explanation || ""}
          onQuestionChange={(value) => handleChange("question", value)}
          onExplanationChange={(value) => handleChange("explanation", value)}
          index={index}
        />
        
        <QuestionTypeSelector
          hasMultipleChoice={!!editedQuestion.options && Array.isArray(editedQuestion.options)}
          onSelectTextAnswer={convertToTextAnswer}
          onSelectMultipleChoice={addInitialOptions}
        />

        {editedQuestion.options && Array.isArray(editedQuestion.options) && !isDualChoice && (
          <MultipleChoiceEditor
            options={editedQuestion.options}
            correctAnswer={editedQuestion.correctAnswer}
            onOptionChange={handleOptionChange}
            onCorrectAnswerChange={(value) => handleChange("correctAnswer", value)}
            onAddOption={addOption}
            onRemoveOption={removeOption}
          />
        )}

        {isDualChoice && (
          <DualChoiceEditor
            primaryOptions={editedQuestion.primaryOptions || []}
            secondaryOptions={editedQuestion.secondaryOptions || []}
            correctPrimaryAnswer={editedQuestion.correctPrimaryAnswer}
            correctSecondaryAnswer={editedQuestion.correctSecondaryAnswer}
            onPrimaryOptionChange={handlePrimaryOptionChange}
            onSecondaryOptionChange={handleSecondaryOptionChange}
            onCorrectPrimaryAnswerChange={(value) => handleChange("correctPrimaryAnswer", value)}
            onCorrectSecondaryAnswerChange={(value) => handleChange("correctSecondaryAnswer", value)}
          />
        )}

        {(!editedQuestion.options || !Array.isArray(editedQuestion.options)) && !isDualChoice && (
          <TextAnswerEditor
            correctAnswer={editedQuestion.correctAnswer || ""}
            onCorrectAnswerChange={(value) => handleChange("correctAnswer", value)}
            index={index}
          />
        )}

        {shouldShowDifficulty && (
          <DifficultySelector
            difficulty={editedQuestion.difficulty || "medium"}
            onDifficultyChange={(value) => handleChange("difficulty", value)}
            index={index}
          />
        )}

        {editedQuestion.subTopicId && (
          <div className="text-sm text-muted-foreground">
            Subtopic ID: {editedQuestion.subTopicId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
