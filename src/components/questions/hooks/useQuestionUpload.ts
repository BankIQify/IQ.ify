
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadQuestionImage } from "../utils/questionUploadUtils";
import type { QuestionType } from "@/types/questions";
import type { QuestionContent } from "./types";

export const useQuestionUpload = (
  subTopicId: string,
  questionType: QuestionType,
  manualQuestion: string,
  questionImage: File | null,
  answerImage: File | null,
  options: string[],
  correctAnswerIndex: number,
  correctTextAnswer: string,
  primaryOptions: string[],
  secondaryOptions: string[],
  correctPrimaryIndex: number,
  correctSecondaryIndex: number,
  resetForm: () => void,
  validateQuestionData: () => boolean
) => {
  const [isProcessingManual, setIsProcessingManual] = useState(false);

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

      const questionContent: QuestionContent = {
        question: manualQuestion,
        imageUrl: questionImageUrl,
        explanation: "", // Initialize with empty string, will be filled by AI
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

      // Use type assertion to ensure compatibility with Supabase's expected types
      const { error: insertError } = await supabase
        .from('questions')
        .insert({
          content: {
            ...questionContent,
            explanation: explanationData.explanation,
          },
          sub_topic_id: subTopicId,
          ai_generated: false,
          question_type: questionType as any, // Use type assertion to bypass type checking
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
    isProcessingManual,
    handleManualUpload
  };
};
