
import { useState } from "react";

export const useExamNavigation = (questionsLength: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questionsLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    handleNextQuestion,
    handlePreviousQuestion
  };
};
