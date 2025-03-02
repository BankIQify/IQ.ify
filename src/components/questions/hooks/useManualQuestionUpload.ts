
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
  
  const [primaryOptions, setPrimaryOptions] = useState<string[]>(["", "", "", ""]);
  const [secondaryOptions, setSecondaryOptions] = useState<string[]>(["", "", "", ""]);
  const [correctPrimaryIndex, setCorrectPrimaryIndex] = useState(0);
  const [correctSecondaryIndex, setCorrectSecondaryIndex] = useState(0);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handlePrimaryOptionChange = (index: number, value: string) => {
    const newOptions = [...primaryOptions];
    newOptions[index] = value;
    setPrimaryOptions(newOptions);
  };

  const handleSecondaryOptionChange = (index: number, value: string) => {
    const newOptions = [...secondaryOptions];
    newOptions[index] = value;
    setSecondaryOptions(newOptions);
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

    if (questionType === "multiple_choice" && options.some(opt => !opt.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all options for multiple choice question",
        variant: "destructive"
      });
      return false;
    }

    if (questionType === "dual_choice" && 
        (primaryOptions.some(opt => !opt.trim()) || secondaryOptions.some(opt => !opt.trim()))) {
      toast({
        title: "Error",
        description: "Please fill in all options for both lists in dual choice question",
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
    setPrimaryOptions(["", "", "", ""]);
    setSecondaryOptions(["", "", "", ""]);
    setCorrectPrimaryIndex(0);
    setCorrectSecondaryIndex(0);
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

      const questionContent: {
        question: string;
        imageUrl?: string;
        options?: string[];
        correctAnswer?: string;
        answerImageUrl?: string;
        primaryOptions?: string[];
        secondaryOptions?: string[];
        correctPrimaryAnswer?: string;
        correctSecondaryAnswer?: string;
        explanation?: string;
      } = {
        question: manualQuestion,
        imageUrl: questionImageUrl,
      };

      if (questionType === "multiple_choice") {
        questionContent.options = options;
        questionContent.correctAnswer = options[correctAnswerIndex];
      } else if (questionType === "dual_choice") {
        questionContent.primaryOptions = primaryOptions;
        questionContent.secondaryOptions = secondaryOptions;
        questionContent.correctPrimaryAnswer = primaryOptions[correctPrimaryIndex];
        questionContent.correctSecondaryAnswer = secondaryOptions[correctSecondaryIndex];
      } else if (questionType === "text") {
        questionContent.correctAnswer = correctTextAnswer;
      } else if (questionType === "image") {
        questionContent.answerImageUrl = answerImageUrl;
      }

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
    primaryOptions,
    secondaryOptions,
    correctPrimaryIndex,
    correctSecondaryIndex,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    setCorrectPrimaryIndex,
    setCorrectSecondaryIndex,
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
