import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { detectDuplicateQuestions } from "../utils/duplicationDetector";
import type { QuestionCategory, QuestionContent } from "@/types/questions";
import { useAuth } from "@/contexts/AuthContext";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/postgrest-js';

interface Question {
  id: string;
  content: QuestionContent;
  question_type: string;
  sub_topic_id: string;
  sub_topics: {
    id: string;
    name: string;
    section_id: string;
    question_sections: {
      category: QuestionCategory;
    }[];
  }[];
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryQuery = async (queryFn: () => Promise<any>, retries = 0): Promise<any> => {
  try {
    return await queryFn();
  } catch (error: any) {
    if (retries < MAX_RETRIES && (error.message?.includes('timeout') || error.message?.includes('offline'))) {
      console.log(`Retrying query attempt ${retries + 1} of ${MAX_RETRIES}...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryQuery(queryFn, retries + 1);
    }
    throw error;
  }
};

export const useQuestionBank = () => {
  const { isAdmin, authInitialized } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [subTopicId, setSubTopicId] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Function to force refresh
  const refreshQuestions = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Fetch sub-topics based on selected category
  const { data: subTopics } = useQuery({
    queryKey: ['bank-subTopics', category],
    queryFn: async () => {
      if (category === "all") return [];

      const { data: sections } = await supabase
        .from('question_sections')
        .select('id')
        .eq('category', category)
        .single();

      if (!sections?.id) return [];

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .eq('section_id', sections.id);

      if (error) throw error;
      return data;
    },
    enabled: authInitialized && category !== "all",
  });

  // Build base query for questions
  const buildQuestionQuery = async () => {
    let baseQuery = supabase.from('questions');

    // Build the select query
    const selectQuery = baseQuery.select(`
      id,
      content,
      question_type,
      sub_topic_id,
      sub_topics (
        id,
        name,
        section_id,
        question_sections (
          category
        )
      )
    `).order('created_at', { ascending: false });

    // Apply filters conditionally
    let filteredQuery = selectQuery;
    
    if (category !== "all") {
      filteredQuery = filteredQuery.eq('sub_topics.question_sections.category', category);
    }

    if (subTopicId !== "all") {
      filteredQuery = filteredQuery.eq('sub_topic_id', subTopicId);
    }

    if (searchQuery) {
      filteredQuery = filteredQuery.textSearch('content->>question', searchQuery);
    }

    return filteredQuery;
  };

  // Build count query for questions
  const buildCountQuery = async () => {
    let baseQuery = supabase.from('questions').select('*', { count: 'exact', head: true });

    // Apply filters conditionally
    let filteredQuery = baseQuery;
    
    if (category !== "all") {
      filteredQuery = filteredQuery.eq('sub_topics.question_sections.category', category);
    }

    if (subTopicId !== "all") {
      filteredQuery = filteredQuery.eq('sub_topic_id', subTopicId);
    }

    if (searchQuery) {
      filteredQuery = filteredQuery.textSearch('content->>question', searchQuery);
    }

    return filteredQuery;
  };

  // Fetch total count of questions matching filters
  const countQuery = useQuery({
    queryKey: ['bank-questions-count', category, subTopicId, searchQuery, showDuplicatesOnly, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching question count...');
      
      const { count, error } = await buildCountQuery();

      if (error) {
        console.error('Error fetching question count:', error);
        throw new Error(`Failed to fetch question count: ${error.message}`);
      }
      
      console.log('Total question count:', count);
      setTotalCount(count || 0);
      return count;
    },
    enabled: authInitialized,
  });

  // Fetch questions with filters and pagination
  const { data: questions, isLoading, error: queryError } = useQuery({
    queryKey: ['bank-questions', category, subTopicId, searchQuery, currentPage, itemsPerPage, showDuplicatesOnly, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching questions with params:', {
        category,
        subTopicId,
        searchQuery,
        currentPage,
        itemsPerPage,
        isAdmin,
        authInitialized
      });

      return retryQuery(async () => {
        try {
          // Get questions
          const { data, error } = await buildQuestionQuery();

          if (error) {
            console.error('Error fetching questions:', error);
            throw new Error(`Failed to fetch questions: ${error.message}`);
          }

          if (!data || data.length === 0) {
            console.log('No questions found with current filters');
            return [];
          }

          // Apply pagination
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const paginatedData = data.slice(start, end);
          
          console.log('Fetched questions:', {
            total: data.length,
            paginated: paginatedData.length,
            start,
            end
          });

          // Format the questions according to the expected type
          const formattedQuestions = paginatedData.map(q => {
            const subTopic = Array.isArray(q.sub_topics) ? q.sub_topics[0] : q.sub_topics;
            const questionSection = subTopic?.question_sections?.[0];
            
            return {
              id: q.id,
              content: q.content as QuestionContent,
              question_type: q.question_type,
              sub_topics: [{
                id: subTopic?.id || '',
                name: subTopic?.name || '',
                question_sections: [{
                  category: questionSection?.category || (category !== "all" ? category : "verbal")
                }]
              }]
            };
          });

          return formattedQuestions;
        } catch (error: any) {
          console.error('Error in question bank query:', error);
          throw new Error(`Failed to process questions: ${error.message}`);
        }
      });
    },
    enabled: authInitialized,
    retry: 3,
    retryDelay: 1000,
  });

  // Process questions to detect duplicates
  const processedQuestions = useMemo(() => {
    if (!questions) return [];
    
    const { questionsWithDuplicateFlags, duplicatesFound } = detectDuplicateQuestions(questions);
    
    // Filter to only show duplicates if that option is selected
    if (showDuplicatesOnly) {
      return questionsWithDuplicateFlags.filter(q => q.hasSimilar);
    }
    
    return questionsWithDuplicateFlags;
  }, [questions, showDuplicatesOnly]);

  return {
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    subTopicId,
    setSubTopicId,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    showDuplicatesOnly,
    setShowDuplicatesOnly,
    subTopics,
    isLoading,
    error: queryError,
    processedQuestions,
    refreshQuestions,
    totalCount
  };
};
