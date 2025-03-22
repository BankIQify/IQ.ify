import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionItem } from "./types";
import { PlusCircle, MinusCircle } from "lucide-react";

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

  const convertToTextAnswer = () => {
    setEditedQuestion((prev) => {
      const { options, ...rest } = prev;
      const updated = { 
        ...rest, 
        correctAnswer: "" 
      };
      onUpdateQuestion(updated);
      return updated;
    });
  };

  const isDualChoice = !!editedQuestion.primaryOptions && !!editedQuestion.secondaryOptions;
  
  const shouldShowDifficulty = category === "brain_training";

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor={`question-${index}`}>Question</Label>
          <Textarea
            id={`question-${index}`}
            value={editedQuestion.question || ""}
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

        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant={!editedQuestion.options ? "default" : "outline"}
            onClick={convertToTextAnswer}
            className="flex-1"
          >
            Text Answer
          </Button>
          <Button 
            type="button" 
            variant={editedQuestion.options ? "default" : "outline"}
            onClick={addInitialOptions}
            className="flex-1"
          >
            Multiple Choice
          </Button>
        </div>

        {editedQuestion.options && Array.isArray(editedQuestion.options) && !isDualChoice && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Options</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addOption}
                className="h-8"
              >
                <PlusCircle className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(i)}
                  disabled={editedQuestion.options!.length <= 1}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

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

        {shouldShowDifficulty && (
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
