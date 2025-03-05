
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { QuestionItem } from "./types";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onUpdateQuestion: (index: number, updatedQuestion: QuestionItem) => void;
}

export const QuestionEditCard = ({ 
  question, 
  index, 
  onUpdateQuestion 
}: QuestionEditCardProps) => {
  const handleTextChange = (field: string, value: string) => {
    onUpdateQuestion(index, { ...question, [field]: value });
  };

  const handleOptionChange = (optionIndex: number, value: string, optionsField: string) => {
    const options = [...(question[optionsField] as string[])];
    options[optionIndex] = value;
    
    let correctAnswerField: string;
    let correctAnswer: string;
    
    if (optionsField === 'options') {
      correctAnswerField = 'correctAnswer';
      correctAnswer = question.correctAnswer as string;
      
      // If the changed option was the correct answer, update the correctAnswer as well
      if (question.options && question.correctAnswer === question.options[optionIndex]) {
        correctAnswer = value;
      }
    } else if (optionsField === 'primaryOptions') {
      correctAnswerField = 'correctPrimaryAnswer';
      correctAnswer = question.correctPrimaryAnswer as string;
      
      if (question.primaryOptions && question.correctPrimaryAnswer === question.primaryOptions[optionIndex]) {
        correctAnswer = value;
      }
    } else { // secondaryOptions
      correctAnswerField = 'correctSecondaryAnswer';
      correctAnswer = question.correctSecondaryAnswer as string;
      
      if (question.secondaryOptions && question.correctSecondaryAnswer === question.secondaryOptions[optionIndex]) {
        correctAnswer = value;
      }
    }
    
    onUpdateQuestion(index, { 
      ...question, 
      [optionsField]: options,
      [correctAnswerField]: correctAnswer
    });
  };

  const handleSetCorrectAnswer = (optionValue: string, correctAnswerField: string) => {
    onUpdateQuestion(index, { ...question, [correctAnswerField]: optionValue });
  };

  return (
    <Card key={index} className="p-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
          <Textarea
            id={`question-${index}`}
            value={question.question}
            onChange={(e) => handleTextChange('question', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>

        {question.options && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-1">
              {question.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(optionIndex, e.target.value, 'options')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant={option === question.correctAnswer ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSetCorrectAnswer(option, 'correctAnswer')}
                  >
                    {option === question.correctAnswer ? "Correct" : "Set as correct"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.primaryOptions && question.secondaryOptions && (
          <div className="space-y-4">
            <div>
              <Label>Primary Options</Label>
              <div className="space-y-2 mt-1">
                {question.primaryOptions.map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(optionIndex, e.target.value, 'primaryOptions')}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={option === question.correctPrimaryAnswer ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetCorrectAnswer(option, 'correctPrimaryAnswer')}
                    >
                      {option === question.correctPrimaryAnswer ? "Correct" : "Set as correct"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Secondary Options</Label>
              <div className="space-y-2 mt-1">
                {question.secondaryOptions.map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(optionIndex, e.target.value, 'secondaryOptions')}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant={option === question.correctSecondaryAnswer ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSetCorrectAnswer(option, 'correctSecondaryAnswer')}
                    >
                      {option === question.correctSecondaryAnswer ? "Correct" : "Set as correct"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor={`explanation-${index}`}>Explanation</Label>
          <Textarea
            id={`explanation-${index}`}
            value={question.explanation}
            onChange={(e) => handleTextChange('explanation', e.target.value)}
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
};
