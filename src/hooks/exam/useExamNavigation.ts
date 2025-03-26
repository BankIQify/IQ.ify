
import { useState } from "react";
import { Question } from "@/types/exam";

interface UseExamNavigationProps {
  questions: Question[];
}

export const useExamNavigation = ({ questions }: UseExamNavigationProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  const handleSelectAnswer = (answerId: string | number, examCompleted: boolean, reviewMode: boolean) => {
    if (examCompleted && !reviewMode) return;
    
    if (questions.length === 0) return;
    
    setAnswers({
      ...answers,
      [questions[currentQuestionIndex].id]: answerId
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    answers,
    setAnswers,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion
  };
};
