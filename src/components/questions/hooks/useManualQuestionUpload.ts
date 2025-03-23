
import { useState } from "react";
import type { QuestionType } from "@/types/questions";
import { useOptionsHandlers } from "./useOptionsHandlers";
import { useQuestionValidation } from "./useQuestionValidation";
import { useQuestionUpload } from "./useQuestionUpload";

export const useManualQuestionUpload = (subTopicId: string) => {
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [manualQuestion, setManualQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [questionImage, setQuestionImage] = useState<File | null>(null);
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [correctTextAnswer, setCorrectTextAnswer] = useState("");
  
  const {
    options,
    primaryOptions,
    secondaryOptions,
    correctAnswerIndex,
    correctPrimaryIndex,
    correctSecondaryIndex,
    setCorrectAnswerIndex,
    setCorrectPrimaryIndex,
    setCorrectSecondaryIndex,
    handleOptionChange,
    handlePrimaryOptionChange,
    handleSecondaryOptionChange,
    addOption,
    removeOption,
    resetOptions
  } = useOptionsHandlers();
  
  const { validateQuestionData: validateData } = useQuestionValidation();
  
  const validateQuestionData = (): boolean => {
    return validateData(
      questionType,
      subTopicId,
      manualQuestion,
      options,
      primaryOptions,
      secondaryOptions,
      correctTextAnswer,
      questionImage,
      answerImage
    );
  };

  const resetForm = () => {
    setManualQuestion("");
    setExplanation("");
    setQuestionImage(null);
    setAnswerImage(null);
    setCorrectTextAnswer("");
    resetOptions();
  };

  const { 
    isProcessingManual, 
    handleManualUpload 
  } = useQuestionUpload(
    subTopicId,
    questionType,
    manualQuestion,
    explanation,
    questionImage,
    answerImage,
    options,
    correctAnswerIndex,
    correctTextAnswer,
    primaryOptions,
    secondaryOptions,
    correctPrimaryIndex,
    correctSecondaryIndex,
    resetForm,
    validateQuestionData
  );

  return {
    questionType,
    manualQuestion,
    explanation,
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
    setExplanation,
    setQuestionImage,
    setAnswerImage,
    handleOptionChange,
    setCorrectAnswerIndex,
    setCorrectTextAnswer,
    handleManualUpload,
    addOption,
    removeOption
  };
};
