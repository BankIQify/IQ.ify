<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useState, useCallback } from "react";

export const useExamNavigation = (questionsLength: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const handleNextQuestion = useCallback(() => {
<<<<<<< HEAD
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
=======
    if (currentQuestionIndex < questionsLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questionsLength]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  
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
