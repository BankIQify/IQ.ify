
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/types/exam";

interface UseExamSubmissionProps {
  questions: Question[];
  answers: Record<string, string | number>;
}

export const useExamSubmission = ({ questions, answers }: UseExamSubmissionProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSubmitExam = async () => {
    if (Object.keys(answers).length === 0) {
      toast({
        title: "Warning",
        description: "Please answer at least one question before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      let correctAnswers = 0;
      
      questions.forEach(question => {
        // Get the correct answer from the question content
        const correctAnswer = question.content.answer;
        
        if (correctAnswer === undefined) {
          console.error('No correct answer found for question:', question);
          return;
        }
        
        // Ensure we're comparing values of the same type
        const userAnswer = answers[question.id];
        
        // Strict comparison after ensuring types match
        const isCorrect = 
          typeof userAnswer === 'number' && typeof correctAnswer === 'number' 
            ? userAnswer === correctAnswer
            : String(userAnswer) === String(correctAnswer);
        
        if (isCorrect) {
          correctAnswers++;
        }
      });
      
      console.log(`Correct answers: ${correctAnswers} out of ${questions.length}`);
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      
      // We're no longer storing exam results in the database
      // This only logs to the console for development purposes
      console.log('Exam completed:', {
        score: finalScore,
        completedAt: new Date().toISOString()
      });
      
      setExamCompleted(true);
      
      toast({
        title: "Exam Completed",
        description: `Your score: ${finalScore}% (${correctAnswers}/${questions.length} correct)`
      });
    } catch (error: any) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit exam",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startReviewMode = () => {
    setReviewMode(true);
    setCurrentQuestionIndex(0);
  };
  
  const exitReviewMode = () => {
    setReviewMode(false);
    
    // Upon exiting review mode, clear all exam data
    if (examCompleted) {
      toast({
        title: "Exam Discarded",
        description: "This exam has been completed and will not be saved."
      });
    }
  };

  return {
    submitting,
    examCompleted,
    score,
    reviewMode,
    handleSubmitExam,
    startReviewMode,
    exitReviewMode,
    setCurrentQuestionIndex,
    currentQuestionIndex
  };
};
