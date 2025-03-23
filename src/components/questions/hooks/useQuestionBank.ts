
import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { detectDuplicateQuestions } from "../utils/duplicationDetector";
import type { QuestionCategory } from "@/types/questions";

export const useQuestionBank = () => {
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
    enabled: category !== "all",
  });

  // Fetch total count of questions matching filters
  useQuery({
    queryKey: ['bank-questions-count', category, subTopicId, searchQuery, showDuplicatesOnly, refreshTrigger],
    queryFn: async () => {
      let query = supabase
        .from('questions')
        .select(`
          id,
          sub_topics (
            question_sections (
              category
            )
          )
        `, { count: 'exact' });

      if (category !== "all") {
        query = query.eq('sub_topics.question_sections.category', category);
      }

      if (subTopicId !== "all") {
        query = query.eq('sub_topic_id', subTopicId);
      }

      if (searchQuery) {
        query = query.textSearch('content->>question', searchQuery);
      }

      const { count, error } = await query;

      if (error) throw error;
      
      setTotalCount(count || 0);
      return count;
    }
  });

  // Fetch questions with filters and pagination
  const { data: questions, isLoading } = useQuery({
    queryKey: ['bank-questions', category, subTopicId, searchQuery, currentPage, itemsPerPage, showDuplicatesOnly, refreshTrigger],
    queryFn: async () => {
      let query = supabase
        .from('questions')
        .select(`
          id,
          content,
          sub_topics (
            name,
            question_sections (
              category
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (category !== "all") {
        query = query.eq('sub_topics.question_sections.category', category);
      }

      if (subTopicId !== "all") {
        query = query.eq('sub_topic_id', subTopicId);
      }

      if (searchQuery) {
        query = query.textSearch('content->>question', searchQuery);
      }

      // Calculate pagination range
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      
      // Add pagination
      query = query.range(start, end);

      const { data, error } = await query;

      if (error) throw error;

      const formattedQuestions = data.map(q => ({
        id: q.id,
        content: q.content as any,
        sub_topics: q.sub_topics
      }));

      return formattedQuestions;
    }
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
    processedQuestions,
    refreshQuestions,
    totalCount
  };
};
