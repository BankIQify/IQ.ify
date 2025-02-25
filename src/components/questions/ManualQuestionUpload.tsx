
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type QuestionType = Database["public"]["Enums"]["question_type"];

interface ManualQuestionUploadProps {
  subTopicId: string;
}

export const ManualQuestionUpload = ({ subTopicId }: ManualQuestionUploadProps) => {
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [manualQuestion, setManualQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [correctTextAnswer, setCorrectTextAnswer] = useState("");
  const [correctImageCoordinates, setCorrectImageCoordinates] = useState({ x: 0, y: 0 });
  const [isProcessingManual, setIsProcessingManual] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuestionImage(e.target.files[0]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleManualUpload = async () => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive"
      });
      return;
    }

    if (!manualQuestion) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    // Validation based on question type
    if (questionType === "multiple_choice" && options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all options for multiple choice question",
        variant: "destructive"
      });
      return;
    }

    if (questionType === "text" && !correctTextAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide the correct text answer",
        variant: "destructive"
      });
      return;
    }

    if (questionType === "image" && !questionImage) {
      toast({
        title: "Error",
        description: "Please upload an image for the image-based question",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingManual(true);

    try {
      let imageUrl = null;
      if (questionImage) {
        const fileExt = questionImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, questionImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      // Prepare question content based on type
      let questionContent = {
        question: manualQuestion,
        imageUrl: imageUrl,
      };

      if (questionType === "multiple_choice") {
        questionContent = {
          ...questionContent,
          options,
          correctAnswer: options[correctAnswerIndex],
        };
      } else if (questionType === "text") {
        questionContent = {
          ...questionContent,
          correctAnswer: correctTextAnswer,
        };
      } else if (questionType === "image") {
        questionContent = {
          ...questionContent,
          correctCoordinates: correctImageCoordinates,
        };
      }

      // Get AI-generated explanation
      const { data: explanationData, error: explanationError } = await supabase.functions.invoke('generate-explanation', {
        body: {
          ...questionContent,
          type: questionType,
        }
      });

      if (explanationError) throw explanationError;

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: {
            ...questionContent,
            explanation: explanationData.explanation,
          },
          sub_topic_id: subTopicId,
          ai_generated: false,
          question_type: questionType,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Question uploaded successfully with AI-generated explanation.",
      });

      // Reset form
      setManualQuestion("");
      setQuestionImage(null);
      setOptions(["", "", "", ""]);
      setCorrectAnswerIndex(0);
      setCorrectTextAnswer("");
      setCorrectImageCoordinates({ x: 0, y: 0 });
    } catch (error) {
      console.error('Error uploading question:', error);
      toast({
        title: "Error",
        description: "Failed to upload question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingManual(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Question Type</Label>
        <Select value={questionType} onValueChange={(value: QuestionType) => setQuestionType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          placeholder="Enter your question..."
          value={manualQuestion}
          onChange={(e) => setManualQuestion(e.target.value)}
          className="h-24"
        />
      </div>

      {questionType !== "text" && (
        <div>
          <Label htmlFor="questionImage">Question Image {questionType === "image" ? "(Required)" : "(Optional)"}</Label>
          <Input
            id="questionImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1"
          />
        </div>
      )}

      {questionType === "multiple_choice" && (
        <div className="space-y-4">
          <Label>Answer Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className={correctAnswerIndex === index ? "border-green-500 border-2" : ""}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswerIndex === index}
                onChange={() => setCorrectAnswerIndex(index)}
                className="mt-3"
              />
            </div>
          ))}
        </div>
      )}

      {questionType === "text" && (
        <div>
          <Label htmlFor="correctAnswer">Correct Answer</Label>
          <Input
            id="correctAnswer"
            value={correctTextAnswer}
            onChange={(e) => setCorrectTextAnswer(e.target.value)}
            placeholder="Enter the correct answer"
          />
        </div>
      )}

      {questionType === "image" && (
        <div className="space-y-4">
          <Label>Correct Answer Coordinates</Label>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="coordX">X Coordinate</Label>
              <Input
                id="coordX"
                type="number"
                value={correctImageCoordinates.x}
                onChange={(e) => setCorrectImageCoordinates(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="coordY">Y Coordinate</Label>
              <Input
                id="coordY"
                type="number"
                value={correctImageCoordinates.y}
                onChange={(e) => setCorrectImageCoordinates(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleManualUpload}
        disabled={isProcessingManual || !subTopicId}
        className="w-full"
      >
        {isProcessingManual ? "Processing..." : "Upload Question"}
      </Button>
    </div>
  );
};

