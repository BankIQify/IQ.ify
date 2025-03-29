import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/types/exam";

interface UseExamAnswersProps {
  questions: Question[];
  currentQuestionIndex: number;
  examCompleted: boolean;
  reviewMode: boolean;
}

export const useExamAnswers = ({ 
  questions, 
  currentQuestionIndex, 
  examCompleted, 
  reviewMode 
}: UseExamAnswersProps) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAnswer = (answerId: string | number) => {
    if (examCompleted && !reviewMode) return;
    
    if (currentQuestionIndex < questions.length) {
      console.log('Selected answer:', answerId, 'for question:', questions[currentQuestionIndex].id);
      
      setAnswers({
        ...answers,
        [questions[currentQuestionIndex].id]: answerId
      });
    }
  };

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
        const correctAnswer = question.content.answer !== undefined 
          ? question.content.answer 
          : question.content.correctAnswer;
        
        if (correctAnswer === undefined) {
          console.error('No correct answer found for question:', question);
          return;
        }
        
        // Ensure we're comparing values of the same type
        const userAnswer = answers[question.id];
        
        if (userAnswer === undefined) {
          // Unanswered question
          return;
        }
        
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
      
      toast({
        title: "Exam Completed",
        description: `Your score: ${finalScore}% (${correctAnswers}/${questions.length} correct)`
      });
      
      return finalScore;
    } catch (error: any) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit exam",
        variant: "destructive"
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    answers,
    score,
    submitting,
    handleSelectAnswer,
    handleSubmitExam,
    setScore
  };
};
