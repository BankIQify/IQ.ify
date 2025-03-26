
import { useState, useCallback } from "react";

export const useExamNavigation = (questionsLength: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questionsLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questionsLength]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);
  
  const jumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questionsLength) {
      setCurrentQuestionIndex(index);
    }
  }, [questionsLength]);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    handleNextQuestion,
    handlePreviousQuestion,
    jumpToQuestion
  };
};
