
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, ExamData } from "@/types/exam";
import { fetchExamById, fetchExamQuestions } from "@/services/examService";

interface UseExamDataProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExamData = ({ examId, userId }: UseExamDataProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

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

  return {
    loading,
    exam,
    questions
  };
};
