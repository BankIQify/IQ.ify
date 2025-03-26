
import { supabase } from "@/integrations/supabase/client";
import { ExamData, Question, ExamResult } from "@/types/exam";

export const fetchExamById = async (examId: string): Promise<ExamData> => {
  console.log('Fetching exam with ID:', examId);
  
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', examId)
    .single();
  
  if (error) {
    console.error('Error fetching exam:', error);
    throw error;
  }
  
  console.log('Exam data retrieved:', data);
  return data as ExamData;
};

export const fetchExamQuestions = async (
  exam: ExamData,
  limit: number
): Promise<Question[]> => {
  console.log('Fetching questions for exam:', exam.id, 'with limit:', limit);
  
  let query = supabase
    .from('questions')
    .select('id, content, question_type');
  
  if (exam.is_standard) {
    console.log('Fetching questions for standard exam in category:', exam.category);
    
    const { data: sectionIds, error: sectionsError } = await supabase
      .from('question_sections')
      .select('id')
      .eq('category', exam.category as "verbal" | "non_verbal" | "brain_training");
    
    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError);
      throw sectionsError;
    }
    
    console.log('Section IDs found:', sectionIds);
    
    if (sectionIds.length === 0) {
      console.warn('No sections found for category:', exam.category);
      return [];
    }
    
    const { data: subTopicIds, error: subTopicsError } = await supabase
      .from('sub_topics')
      .select('id')
      .in('section_id', sectionIds.map(section => section.id));
    
    if (subTopicsError) {
      console.error('Error fetching sub-topics:', subTopicsError);
      throw subTopicsError;
    }
    
    console.log('Sub-topic IDs found:', subTopicIds);
    
    if (subTopicIds.length === 0) {
      console.warn('No sub-topics found for the sections');
      return [];
    }
    
    query = query.in('sub_topic_id', subTopicIds.map(subTopic => subTopic.id));
  } else {
    console.log('Fetching questions for custom exam:', exam.id);
    
    const { data: examSubTopics, error: subTopicsError } = await supabase
      .from('exam_sub_topics')
      .select('sub_topic_id')
      .eq('exam_id', exam.id);
    
    if (subTopicsError) {
      console.error('Error fetching exam sub-topics:', subTopicsError);
      throw subTopicsError;
    }
    
    console.log('Exam sub-topic IDs found:', examSubTopics);
    
    if (examSubTopics.length > 0) {
      query = query.in('sub_topic_id', examSubTopics.map(est => est.sub_topic_id));
    } else {
      console.warn('No sub-topics associated with this custom exam');
    }
  }
  
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} questions`);
  
  if (!data || data.length === 0) {
    console.warn('No questions found for the exam');
    return [];
  }
  
  // Log a sample question to understand its structure
  console.log('Sample question:', data[0]);
  
  // Check if content is a string and safely handle it
  const validateContent = (content: any) => {
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse question content string:', e);
        return { question: 'Error parsing question' };
      }
    }
    return content;
  };
  
  // Map the questions to ensure consistent structure
  const questions = data.map(q => {
    // Verify and parse content if needed
    const validContent = validateContent(q.content);
    
    if (!validContent || !validContent.question) {
      console.error('Invalid question content detected:', q);
    }
    
    return {
      id: q.id,
      content: validContent,
      questionType: q.question_type
    };
  }) as Question[];
  
  return questions;
};

export const submitExamResult = async (result: ExamResult): Promise<void> => {
  console.log('Submitting exam result:', result);
  
  const { error } = await supabase
    .from('exam_results')
    .insert({
      exam_id: result.examId,
      score: result.score,
      user_id: result.userId
    });
  
  if (error) {
    console.error('Error submitting exam result:', error);
    throw error;
  }
  
  console.log('Exam result submitted successfully');
};
