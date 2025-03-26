
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Question, ExamData } from "@/types/exam";
import { fetchExamById, fetchExamQuestions } from "@/services/examService";
import { verbalReasoningLayouts } from "@/components/questions/utils/answer-layouts/verbal-layouts";

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
          let content = typeof q.content === 'string' 
            ? JSON.parse(q.content) 
            : q.content;
            
          console.log('Processing question:', q.id, 'content:', content);
          
          // Special handling for verbal questions
          if (examData.category === 'verbal' && q.sub_topic_id) {
            console.log('Processing verbal question with sub_topic_id:', q.sub_topic_id);
            
            // Get sub-topic name from question
            const subTopicName = q.sub_topic_name || '';
            console.log('Sub-topic name:', subTopicName);
            
            // Normalize sub-topic name to match the keys in verbalReasoningLayouts
            const normalizedSubTopic = subTopicName.toLowerCase().replace(/\s+/g, '_');
            console.log('Normalized sub-topic:', normalizedSubTopic);
            
            // Get the layout config if available
            const layoutConfig = verbalReasoningLayouts[normalizedSubTopic];
            console.log('Layout config for sub-topic:', layoutConfig);
            
            // Enhance content based on layout if needed
            if (layoutConfig) {
              console.log('Applying layout-specific enhancements');
              
              // Ensure options are correctly formatted for verbal questions
              if (layoutConfig.layout === 'multiple_choice' && (!content.options || !Array.isArray(content.options))) {
                console.log('Fixing options format');
                content.options = content.options || [];
                
                // If options are in an unexpected format, try to recover
                if (content.optionA && !Array.isArray(content.options)) {
                  content.options = [
                    content.optionA,
                    content.optionB,
                    content.optionC,
                    content.optionD
                  ].filter(Boolean);
                  console.log('Reconstructed options from optionA/B/C/D format');
                }
              }
            }
          }
          
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
            questionType: q.questionType || q.question_type, // Fixed: Use questionType for consistency
            sub_topic_id: q.sub_topic_id,
            sub_topic_name: q.sub_topic_name
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
