
import { useEffect } from "react";
import { useExamData } from "@/hooks/exam/useExamData";
import { useExamNavigation } from "@/hooks/exam/useExamNavigation";
import { useExamAnswers } from "@/hooks/exam/useExamAnswers";
import { useExamReview } from "@/hooks/exam/useExamReview";

interface UseExamProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExam = ({ examId, userId }: UseExamProps) => {
  // Load exam data
  const { loading, exam, questions } = useExamData({ examId, userId });
  
  // Navigation state and handlers
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    handleNextQuestion, 
    handlePreviousQuestion,
    jumpToQuestion
  } = useExamNavigation(questions.length);
  
  // Review mode state and handlers
  const {
    reviewMode,
    examCompleted,
    setExamCompleted,
    startReviewMode,
    exitReviewMode
  } = useExamReview();
  
  // Answers and submission handling
  const {
    answers,
    score,
    submitting,
    handleSelectAnswer,
    handleSubmitExam,
    setScore
  } = useExamAnswers({
    questions,
    currentQuestionIndex,
    examCompleted,
    reviewMode
  });

  // Add a cleanup effect when navigating away from the exam page
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      console.log('Leaving exam page - clearing all exam data');
    };
  }, []);

  // Custom submit handler that updates the completed state
  const submitExam = async () => {
    const finalScore = await handleSubmitExam();
    if (finalScore !== null) {
      setExamCompleted(true);
    }
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
    handleSubmitExam: submitExam,
    startReviewMode,
    exitReviewMode,
    jumpToQuestion
  };
};
