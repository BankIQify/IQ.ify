
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, ExamData } from "@/types/exam";
import { fetchExamById, fetchExamQuestions, submitExamResult } from "@/services/examService";

interface UseExamProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExam = ({ examId, userId }: UseExamProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (!examId || !userId) return;

    const loadExamData = async () => {
      try {
        setLoading(true);
        console.log('Loading exam data for examId:', examId);
        
        const examData = await fetchExamById(examId);
        console.log('Exam data loaded:', examData);
        setExam(examData);
        
        const questionsData = await fetchExamQuestions(examData, examData.question_count);
        console.log('Questions data loaded:', questionsData);
        
        if (questionsData.length === 0) {
          console.error('No questions returned from the database');
          toast({
            title: "Error",
            description: "No questions available for this exam",
            variant: "destructive"
          });
        }
        
        setQuestions(questionsData);
      } catch (error: any) {
        console.error('Error fetching exam:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load exam",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [examId, userId, toast]);

  const handleSelectAnswer = (answerId: string | number) => {
    if (examCompleted && !reviewMode) return;
    
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
        // Ensure we're comparing values of the same type
        const userAnswer = answers[question.id];
        const correctAnswer = question.content.answer;
        
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
      
      const answeredCount = Object.keys(answers).length;
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      
      if (userId && examId) {
        await submitExamResult({
          examId,
          score: finalScore,
          userId
        });
      }
      
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
