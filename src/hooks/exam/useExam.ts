
import { useEffect } from "react";
import { useExamLoader } from "./useExamLoader";
import { useExamNavigation } from "./useExamNavigation";
import { useExamSubmission } from "./useExamSubmission";

interface UseExamProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExam = ({ examId, userId }: UseExamProps) => {
  // Load exam data
  const { loading, exam, questions } = useExamLoader({ examId, userId });
  
  // Handle navigation
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    handleSelectAnswer: baseHandleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion
  } = useExamNavigation({ questions });
  
  // Handle submission and review
  const {
    submitting,
    examCompleted,
    score,
    reviewMode,
    handleSubmitExam,
    startReviewMode,
    exitReviewMode,
    setCurrentQuestionIndex: setReviewQuestionIndex,
    currentQuestionIndex: reviewQuestionIndex
  } = useExamSubmission({ questions, answers });

  // Sync the question indices when in review mode
  useEffect(() => {
    if (reviewMode) {
      setCurrentQuestionIndex(reviewQuestionIndex);
    }
  }, [reviewMode, reviewQuestionIndex, setCurrentQuestionIndex]);

  // Add a cleanup effect when navigating away from the exam page
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      console.log('Leaving exam page - clearing all exam data');
      // The state will be naturally cleaned up when the component unmounts
    };
  }, []);

  // Wrapper for handleSelectAnswer to include examCompleted and reviewMode
  const handleSelectAnswer = (answerId: string | number) => {
    baseHandleSelectAnswer(answerId, examCompleted, reviewMode);
  };

  return {
    loading,
    submitting,
    exam,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    examCompleted,
    reviewMode,
    score,
    handleSelectAnswer,
    handleNextQuestion,
    handlePreviousQuestion,
    handleSubmitExam,
    startReviewMode,
    exitReviewMode
  };
};
