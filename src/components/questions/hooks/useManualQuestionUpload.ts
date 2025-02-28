
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { QuestionType } from "../ManualQuestionUpload";
import { uploadQuestionImage } from "../utils/questionUploadUtils";

export const useManualQuestionUpload = (subTopicId: string) => {
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

  const validateQuestionData = (): boolean => {
    if (!subTopicId) {
      toast({
        title: "Error",
        description: "Please select a sub-topic",
        variant: "destructive"
      });
      return false;
    }

    if (!manualQuestion) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return false;
    }

    // Validation based on question type
    if (questionType === "multiple_choice" && options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all options for multiple choice question",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "text" && !correctTextAnswer.trim()) {
      toast({
        title: "Error",
        description: "Please provide the correct text answer",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "image" && (!questionImage || !answerImage)) {
      toast({
        title: "Error",
        description: "Please upload both question and answer images",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setManualQuestion("");
    setQuestionImage(null);
    setAnswerImage(null);
    setOptions(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setCorrectTextAnswer("");
  };

  const handleManualUpload = async () => {
    if (!validateQuestionData()) return;

    setIsProcessingManual(true);

    try {
      let questionImageUrl = null;
      let answerImageUrl = null;

      if (questionImage) {
        questionImageUrl = await uploadQuestionImage(questionImage, 'question');
      }

      if (answerImage && questionType === "image") {
        answerImageUrl = await uploadQuestionImage(answerImage, 'answer');
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
      resetForm();
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

  return {
    questionType,
    manualQuestion,
    questionImage,
    answerImage,
    options,
    correctAnswerIndex,
    correctTextAnswer,
    isProcessingManual,
    setQuestionType,
    setManualQuestion,
    setQuestionImage,
    setAnswerImage,
    handleOptionChange,
    setCorrectAnswerIndex,
    setCorrectTextAnswer,
    handleManualUpload
  };
};
