
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionItem } from "./types";

interface QuestionEditCardProps {
  question: QuestionItem;
  index: number;
  onQuestionChange: (updatedQuestion: QuestionItem) => void;
}

export const QuestionEditCard = ({ question, index, onQuestionChange }: QuestionEditCardProps) => {
  const [editedQuestion, setEditedQuestion] = useState<QuestionItem>(question);

  const handleChange = (field: keyof QuestionItem, value: string) => {
    setEditedQuestion((prev) => {
      const updated = { ...prev, [field]: value };
      onQuestionChange(updated);
      return updated;
    });
  };

  const handleOptionChange = (optionIndex: number, value: string) => {
    if (!editedQuestion.options) return;
    
    const newOptions = [...editedQuestion.options];
    newOptions[optionIndex] = value;
    
    setEditedQuestion((prev) => {
      const updated = { ...prev, options: newOptions };
      onQuestionChange(updated);
      return updated;
    });
  };

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
            value={editedQuestion.explanation}
            onChange={(e) => handleChange("explanation", e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Options for multiple choice */}
        {editedQuestion.options && (
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
