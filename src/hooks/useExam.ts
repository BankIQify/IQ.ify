import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, ExamData } from "@/types/exam";
import { fetchExamById, fetchExamQuestions } from "@/services/examService";

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

        // Map the questions to ensure consistent structure
        const mappedQuestions = questionsData.map(q => ({
          id: q.id,
          content: {
            ...q.content,
            // Ensure question content has the correct structure
            question: q.content.question || 'Question not available',
            options: q.content.options || [],
            // Use answer property directly
            answer: q.content.answer !== undefined ? q.content.answer : 0
          },
          questionType: q.questionType
        }));
        
        console.log('Mapped questions:', mappedQuestions);
        setQuestions(mappedQuestions);
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
      
      const answeredCount = Object.keys(answers).length;
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      
      if (userId && examId) {
        // Log performance data for analysis without saving the actual exam
        // This updates a user's progress data without storing their completed exam
        await logUserExamPerformance({
          userId,
          category: exam?.category || 'unknown',
          score: finalScore,
          completedAt: new Date().toISOString()
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

  // Helper function to log performance data for progress analysis without saving the exam
  const logUserExamPerformance = async (data: {
    userId: string;
    category: string;
    score: number;
    completedAt: string;
  }) => {
    try {
      // Log to console for now - in a real implementation, this would send data to a progress tracking service
      console.log('Logging user performance for progress analysis:', data);
      
      // Here you would typically call a function to update the user's progress metrics
      // This is where you'd track improvement over time, areas of strength/weakness, etc.
      // without saving the completed exam itself
    } catch (error) {
      console.error('Error logging user performance:', error);
    }
  };

  const startReviewMode = () => {
    setReviewMode(true);
    setCurrentQuestionIndex(0);
  };
  
  const exitReviewMode = () => {
    setReviewMode(false);
    
    // Upon exiting review mode, clear all exam data since we don't want to keep it
    if (examCompleted) {
      // We'll keep this function call to allow navigating back to practice
      // but the exam data itself should be cleared from state in a real implementation
      toast({
        title: "Exam Discarded",
        description: "This exam has been completed and will not be saved."
      });
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
    handleSubmitExam,
    startReviewMode,
    exitReviewMode
  };
};
