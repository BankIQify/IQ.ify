<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { supabase } from "@/integrations/supabase/client";
import { ExamData, Question } from "@/types/exam";

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
  console.log('Fetching questions for exam:', exam.id, 'with limit:', limit, 'category:', exam.category);
  
  // Enhanced query to also fetch sub_topic information
  let query = supabase
    .from('questions')
    .select(`
      id, 
      content, 
      question_type,
      sub_topic_id,
<<<<<<< HEAD
      sub_topics!inner (
        id,
        name,
        section_id,
        question_sections!inner (
          id,
          category
        )
      )
=======
      sub_topics(name)
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
    `);
  
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
  
  // Add a specific debug log for verbal category
  if (exam.category === 'verbal') {
    console.log('Fetching VERBAL questions - this should include additional debug info');
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
<<<<<<< HEAD
        return content; // Return the original string if it's not JSON
=======
        return { question: 'Error parsing question' };
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      }
    }
    return content;
  };
  
  // Map the questions to ensure consistent structure
  const questions = data.map(q => {
    // Verify and parse content if needed
    const validContent = validateContent(q.content);
<<<<<<< HEAD
    const subTopicData = q.sub_topics as { name: string } | { name: string }[];
    const subTopicName = Array.isArray(subTopicData) ? subTopicData[0]?.name : subTopicData?.name;
    
    // For verbal questions, ensure content is properly structured
    if (exam.category === 'verbal' && typeof validContent === 'string') {
      return {
        id: q.id,
        content: {
          question: validContent,
          explanation: "Verbal reasoning question",
          options: Array.isArray(q.content?.options) ? q.content.options : []
        },
        questionType: q.question_type || 'text',
        sub_topic_id: q.sub_topic_id,
        sub_topic_name: subTopicName
      };
=======
    
    if (!validContent || !validContent.question) {
      console.error('Invalid question content detected:', q);
    }
    
    // For verbal questions, add extra logging
    if (exam.category === 'verbal') {
      console.log('Verbal question content:', validContent);
      console.log('Verbal question sub_topic data:', q.sub_topics);
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
    }
    
    return {
      id: q.id,
      content: validContent,
      questionType: q.question_type,
      sub_topic_id: q.sub_topic_id,
<<<<<<< HEAD
      sub_topic_name: subTopicName
=======
      sub_topic_name: q.sub_topics?.name
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
    };
  }) as Question[];
  
  return questions;
};

// No exam result submission function since we don't want to save completed exams
// Note: We may still want to track aggregated user progress metrics (without storing actual exams)
// This could be implemented in a separate service that only stores summary statistics
