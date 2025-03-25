
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: string;
  content: {
    question: string;
    options?: string[];
    answer: string | number;
  };
  questionType: string;
}

interface UseExamProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExam = ({ examId, userId }: UseExamProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (!examId || !userId) return;

    const fetchExam = async () => {
      try {
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .select('*')
          .eq('id', examId)
          .single();
        
        if (examError) throw examError;
        setExam(examData);
        
        let query = supabase
          .from('questions')
          .select('id, content, question_type');
        
        if (examData.is_standard) {
          const sectionsQuery = await supabase
            .from('question_sections')
            .select('id')
            .eq('category', examData.category);
          
          if (sectionsQuery.error) throw sectionsQuery.error;
          
          const sectionIds = sectionsQuery.data.map(section => section.id);
          
          const subTopicsQuery = await supabase
            .from('sub_topics')
            .select('id')
            .in('section_id', sectionIds);
          
          if (subTopicsQuery.error) throw subTopicsQuery.error;
          
          const subTopicIds = subTopicsQuery.data.map(subTopic => subTopic.id);
          
          query = query.in('sub_topic_id', subTopicIds);
        } else {
          const { data: examSubTopics, error: subTopicsError } = await supabase
            .from('exam_sub_topics')
            .select('sub_topic_id')
            .eq('exam_id', examId);
          
          if (subTopicsError) throw subTopicsError;
          
          if (examSubTopics.length > 0) {
            const subTopicIds = examSubTopics.map(est => est.sub_topic_id);
            query = query.in('sub_topic_id', subTopicIds);
          }
        }
        
        query = query.limit(examData.question_count);
        
        const { data: questionsData, error: questionsError } = await query;
        
        if (questionsError) throw questionsError;
        
        const formattedQuestions = questionsData.map(q => ({
          id: q.id,
          content: q.content,
          questionType: q.question_type
        })) as Question[];
        
        setQuestions(formattedQuestions);
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

    fetchExam();
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
        if (answers[question.id] === question.content.answer) {
          correctAnswers++;
        }
      });
      
      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);
      
      console.log('Submitting exam result with user_id:', userId);
      
      const { error } = await supabase
        .from('exam_results')
        .insert({
          exam_id: examId,
          score: finalScore,
          user_id: userId
        });
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      setExamCompleted(true);
      
      toast({
        title: "Exam Completed",
        description: `Your score: ${finalScore}%`
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
    startReviewMode
  };
};
