
import { useState, useMemo } from "react";
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

  // Fetch questions with filters and pagination
  const { data: questions, isLoading } = useQuery({
    queryKey: ['bank-questions', category, subTopicId, searchQuery, currentPage, itemsPerPage, showDuplicatesOnly],
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

      // If we're only showing duplicates, we need to fetch more items to analyze
      const effectiveItemsPerPage = showDuplicatesOnly ? itemsPerPage * 5 : itemsPerPage;

      // Add pagination
      const start = (currentPage - 1) * effectiveItemsPerPage;
      const end = start + effectiveItemsPerPage - 1;
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
    processedQuestions
  };
};
