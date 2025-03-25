
import { supabase } from "@/integrations/supabase/client";
import { ExamData, Question, ExamResult } from "@/types/exam";

export const fetchExamById = async (examId: string): Promise<ExamData> => {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', examId)
    .single();
  
  if (error) throw error;
  return data as ExamData;
};

export const fetchExamQuestions = async (
  exam: ExamData,
  limit: number
): Promise<Question[]> => {
  let query = supabase
    .from('questions')
    .select('id, content, question_type');
  
  if (exam.is_standard) {
    const { data: sectionIds, error: sectionsError } = await supabase
      .from('question_sections')
      .select('id')
      .eq('category', exam.category as "verbal" | "non_verbal" | "brain_training");
    
    if (sectionsError) throw sectionsError;
    
    const { data: subTopicIds, error: subTopicsError } = await supabase
      .from('sub_topics')
      .select('id')
      .in('section_id', sectionIds.map(section => section.id));
    
    if (subTopicsError) throw subTopicsError;
    
    query = query.in('sub_topic_id', subTopicIds.map(subTopic => subTopic.id));
  } else {
    const { data: examSubTopics, error: subTopicsError } = await supabase
      .from('exam_sub_topics')
      .select('sub_topic_id')
      .eq('exam_id', exam.id);
    
    if (subTopicsError) throw subTopicsError;
    
    if (examSubTopics.length > 0) {
      query = query.in('sub_topic_id', examSubTopics.map(est => est.sub_topic_id));
    }
  }
  
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data.map(q => ({
    id: q.id,
    content: q.content,
    questionType: q.question_type
  })) as Question[];
};

export const submitExamResult = async (result: ExamResult): Promise<void> => {
  const { error } = await supabase
    .from('exam_results')
    .insert({
      exam_id: result.examId,
      score: result.score,
      user_id: result.userId
    });
  
  if (error) throw error;
};
