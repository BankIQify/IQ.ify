
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { QuestionTypeSelector } from "./upload/QuestionTypeSelector";
import { QuestionText } from "./upload/QuestionText";
import { ImageUpload } from "./upload/ImageUpload";
import { MultipleChoiceOptions } from "./upload/MultipleChoiceOptions";
import { TextAnswer } from "./upload/TextAnswer";

type QuestionType = Database["public"]["Enums"]["question_type"];

interface ManualQuestionUploadProps {
  subTopicId: string;
}

export const ManualQuestionUpload = ({ subTopicId }: ManualQuestionUploadProps) => {
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [manualQuestion, setManualQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [correctTextAnswer, setCorrectTextAnswer] = useState("");
  const [isProcessingManual, setIsProcessingManual] = useState(false);

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

    if (questionType === "image" && (!questionImage || !answerImage)) {
      toast({
        title: "Error",
        description: "Please upload both question and answer images",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingManual(true);

    try {
      let questionImageUrl = null;
      let answerImageUrl = null;

      if (questionImage) {
        const fileExt = questionImage.name.split('.').pop();
        const filePath = `question_${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, questionImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath);
          
        questionImageUrl = publicUrl;
      }

      if (answerImage && questionType === "image") {
        const fileExt = answerImage.name.split('.').pop();
        const filePath = `answer_${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-images')
          .upload(filePath, answerImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('question-images')
          .getPublicUrl(filePath);
          
        answerImageUrl = publicUrl;
      }

      // Prepare question content based on type
      const questionContent: {
        question: string;
        imageUrl?: string;
        options?: string[];
        correctAnswer?: string;
        answerImageUrl?: string;
      } = {
        question: manualQuestion,
        imageUrl: questionImageUrl,
      };

      if (questionType === "multiple_choice") {
        questionContent.options = options;
        questionContent.correctAnswer = options[correctAnswerIndex];
      } else if (questionType === "text") {
        questionContent.correctAnswer = correctTextAnswer;
      } else if (questionType === "image") {
        questionContent.answerImageUrl = answerImageUrl;
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
      setAnswerImage(null);
      setOptions(["", "", "", ""]);
      setCorrectAnswerIndex(0);
      setCorrectTextAnswer("");
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
      <QuestionTypeSelector 
        value={questionType}
        onChange={(value) => setQuestionType(value)}
      />

      <QuestionText
        value={manualQuestion}
        onChange={setManualQuestion}
      />

      <ImageUpload
        id="questionImage"
        label="Question Image"
        required={questionType === "image"}
        onChange={setQuestionImage}
      />

      {questionType === "multiple_choice" && (
        <MultipleChoiceOptions
          options={options}
          correctAnswerIndex={correctAnswerIndex}
          onOptionChange={handleOptionChange}
          onCorrectAnswerChange={setCorrectAnswerIndex}
        />
      )}

      {questionType === "text" && (
        <TextAnswer
          value={correctTextAnswer}
          onChange={setCorrectTextAnswer}
        />
      )}

      {questionType === "image" && (
        <ImageUpload
          id="answerImage"
          label="Answer Image"
          required
          onChange={setAnswerImage}
        />
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
