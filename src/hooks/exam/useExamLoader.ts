
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, ExamData } from "@/types/exam";
import { fetchExamById, fetchExamQuestions } from "@/services/examService";

interface UseExamLoaderProps {
  examId: string | undefined;
  userId: string | undefined;
}

export const useExamLoader = ({ examId, userId }: UseExamLoaderProps) => {
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

  return { loading, exam, questions };
};
