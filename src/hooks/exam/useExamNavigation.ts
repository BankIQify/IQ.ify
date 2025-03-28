import { useState, useCallback } from "react";

export const useExamNavigation = (questionsLength: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      const nextIndex = prev + 1;
      return nextIndex < questionsLength ? nextIndex : prev;
    });
  }, [questionsLength]);

  const handlePreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => {
      const prevIndex = prev - 1;
      return prevIndex >= 0 ? prevIndex : prev;
    });
  }, []);
  
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
