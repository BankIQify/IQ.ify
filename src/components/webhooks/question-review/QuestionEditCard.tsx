
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionItem } from "./types";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onUpdateQuestion: (updatedQuestion: QuestionItem) => void;
}

export const QuestionEditCard = ({ question, index, onUpdateQuestion }: QuestionEditCardProps) => {
  const [editedQuestion, setEditedQuestion] = useState<QuestionItem>(question);

  const handleChange = (field: keyof QuestionItem, value: string) => {
    setEditedQuestion((prev) => {
      const updated = { ...prev, [field]: value };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.options) return;
    
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

  // Determine if this is a dual choice question
  const isDualChoice = !!editedQuestion.primaryOptions && !!editedQuestion.secondaryOptions;
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor={`question-${index}`}>Question</Label>
          <Textarea
            id={`question-${index}`}
            value={editedQuestion.question}
            onChange={(e) => handleChange("question", e.target.value)}
            rows={2}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor={`explanation-${index}`}>Explanation</Label>
          <Textarea
            id={`explanation-${index}`}
            value={editedQuestion.explanation || ""}
            onChange={(e) => handleChange("explanation", e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Options for multiple choice */}
        {editedQuestion.options && Array.isArray(editedQuestion.options) && !isDualChoice && (
          <div className="space-y-2">
            <Label>Options</Label>
            {editedQuestion.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  className={
                    option === editedQuestion.correctAnswer
                      ? "border-green-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant={
                    option === editedQuestion.correctAnswer
                      ? "default"
                      : "outline"
                  }
                  onClick={() => handleChange("correctAnswer", option)}
                  className="whitespace-nowrap"
                >
                  {option === editedQuestion.correctAnswer
                    ? "Correct ✓"
                    : "Set as Correct"}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Primary and Secondary Options for dual choice */}
        {isDualChoice && (
          <>
            <div className="space-y-2">
              <Label>Primary Options</Label>
              {editedQuestion.primaryOptions && editedQuestion.primaryOptions.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handlePrimaryOptionChange(i, e.target.value)}
                    className={
                      option === editedQuestion.correctPrimaryAnswer
                        ? "border-green-500"
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant={
                      option === editedQuestion.correctPrimaryAnswer
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleChange("correctPrimaryAnswer", option)}
                    className="whitespace-nowrap"
                  >
                    {option === editedQuestion.correctPrimaryAnswer
                      ? "Correct ✓"
                      : "Set as Correct"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Secondary Options</Label>
              {editedQuestion.secondaryOptions && editedQuestion.secondaryOptions.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleSecondaryOptionChange(i, e.target.value)}
                    className={
                      option === editedQuestion.correctSecondaryAnswer
                        ? "border-green-500"
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant={
                      option === editedQuestion.correctSecondaryAnswer
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleChange("correctSecondaryAnswer", option)}
                    className="whitespace-nowrap"
                  >
                    {option === editedQuestion.correctSecondaryAnswer
                      ? "Correct ✓"
                      : "Set as Correct"}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Text answer input for non-multiple choice questions */}
        {(!editedQuestion.options || !Array.isArray(editedQuestion.options)) && !isDualChoice && (
          <div>
            <Label htmlFor={`correctAnswer-${index}`}>Correct Answer</Label>
            <Input
              id={`correctAnswer-${index}`}
              value={editedQuestion.correctAnswer || ""}
              onChange={(e) => handleChange("correctAnswer", e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        {/* Difficulty selector */}
        <div>
          <Label htmlFor={`difficulty-${index}`}>Difficulty</Label>
          <Select
            value={editedQuestion.difficulty || "medium"}
            onValueChange={(value) => handleChange("difficulty", value)}
          >
            <SelectTrigger id={`difficulty-${index}`}>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
