
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
        const mappedQuestions = questionsData.map(q => {
          // Ensure content is an object
          const content = typeof q.content === 'string' 
            ? JSON.parse(q.content) 
            : q.content;
            
          console.log('Processing question:', q.id, 'content:', content);
          
          return {
            id: q.id,
            content: {
              ...content,
              // Ensure question content has the correct structure
              question: content.question || 'Question not available',
              options: Array.isArray(content.options) ? content.options : [],
              // Handle different answer property formats
              answer: content.answer !== undefined ? content.answer : 
                    content.correctAnswer !== undefined ? content.correctAnswer : 0,
              explanation: content.explanation || ''
            },
            questionType: q.questionType
          };
        });
        
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

  // Add a cleanup effect when navigating away from the exam page
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      console.log('Leaving exam page - clearing all exam data');
      // Clear all state to ensure exam data is not persisted
      setExam(null);
      setQuestions([]);
      setAnswers({});
      setExamCompleted(false);
      setScore(0);
      setReviewMode(false);
    };
  }, []);

  const handleSelectAnswer = (answerId: string | number) => {
    if (examCompleted && !reviewMode) return;
    
    console.log('Selected answer:', answerId, 'for question:', questions[currentQuestionIndex].id);
    
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
        category: exam?.category || 'unknown',
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
