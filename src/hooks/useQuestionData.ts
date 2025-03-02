
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Question, QuestionCategory } from "@/types/questions";

export const useQuestionData = (category: QuestionCategory, subTopicId: string) => {
  const { data: subTopics, isLoading: isLoadingSubTopics } = useQuery({
    queryKey: ['subTopics', category],
    queryFn: async () => {
      console.log('Fetching sub-topics for category:', category);
      
      const { data: sections } = await supabase
        .from('question_sections')
        .select('id')
        .eq('category', category)
        .single();

      if (!sections?.id) {
        console.log('No section found for category:', category);
        return [];
      }

      console.log('Found section:', sections.id);

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .eq('section_id', sections.id);

      if (error) {
        console.error('Error fetching sub-topics:', error);
        throw error;
      }

      console.log('Fetched sub-topics:', data);
      return data;
    }
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['questions', subTopicId],
    queryFn: async () => {
      if (!subTopicId) {
        console.log('No sub-topic selected, skipping question fetch');
        return [];
      }

      console.log('Fetching questions for sub-topic:', subTopicId);

      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          content,
          question_type,
          sub_topics (
            id,
            name
          )
        `)
        .eq('sub_topic_id', subTopicId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching questions:', error);
        throw error;
      }

      console.log('Fetched questions:', data);
      return data.map(q => ({
        id: q.id,
        content: q.content as Question['content'],
        question_type: q.question_type,
        sub_topics: q.sub_topics
      }));
    },
    enabled: !!subTopicId,
  });

  return {
    subTopics,
    questions,
    isLoading: isLoadingSubTopics || isLoadingQuestions,
    isLoadingSubTopics,
    isLoadingQuestions
  };
};
