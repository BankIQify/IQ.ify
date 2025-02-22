
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ManualQuestionUploadProps {
  subTopicId: string;
}

export const ManualQuestionUpload = ({ subTopicId }: ManualQuestionUploadProps) => {
  const [manualQuestion, setManualQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
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

    if (!manualQuestion || options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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

      const { data: explanationData, error: explanationError } = await supabase.functions.invoke('generate-explanation', {
        body: {
          question: manualQuestion,
          options: options,
          correctAnswer: options[correctAnswerIndex],
          imageUrl: imageUrl
        }
      });

      if (explanationError) throw explanationError;

      const questionContent = {
        question: manualQuestion,
        options: options,
        correctAnswer: options[correctAnswerIndex],
        explanation: explanationData.explanation,
        imageUrl: imageUrl
      };

      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: questionContent,
          sub_topic_id: subTopicId,
          ai_generated: false,
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
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          placeholder="Enter your question..."
          value={manualQuestion}
          onChange={(e) => setManualQuestion(e.target.value)}
          className="h-24"
        />
      </div>

      <div>
        <Label htmlFor="questionImage">Question Image (Optional)</Label>
        <Input
          id="questionImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        <Label>Answer Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
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
