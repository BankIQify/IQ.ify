
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { QuestionsList } from "./QuestionsList";
import { QuestionContent } from "@/pages/ManageQuestions";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const CompleteQuestionBank = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [subTopicId, setSubTopicId] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sub-topics based on selected category
  const { data: subTopics } = useQuery({
    queryKey: ['bank-subTopics', category],
    queryFn: async () => {
      if (!category) return [];

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
    enabled: !!category,
  });

  // Fetch questions with filters and pagination
  const { data: questions, isLoading } = useQuery({
    queryKey: ['bank-questions', category, subTopicId, searchQuery, currentPage, itemsPerPage],
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

      if (category) {
        query = query.eq('sub_topics.question_sections.category', category);
      }

      if (subTopicId) {
        query = query.eq('sub_topic_id', subTopicId);
      }

      if (searchQuery) {
        query = query.textSearch('content->>question', searchQuery);
      }

      // Add pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      const { data, error } = await query;

      if (error) throw error;

      return data.map(q => ({
        id: q.id,
        content: q.content as QuestionContent,
        sub_topics: q.sub_topics
      }));
    }
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Search Questions</Label>
            <Input
              type="text"
              placeholder="Search by question text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                <SelectItem value="brain_training">Brain Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sub-topic</Label>
            <Select 
              value={subTopicId} 
              onValueChange={setSubTopicId}
              disabled={!category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sub-topics</SelectItem>
                {subTopics?.map((subTopic) => (
                  <SelectItem key={subTopic.id} value={subTopic.id}>
                    {subTopic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Items per page</Label>
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <p className="text-gray-600">Loading questions...</p>
      ) : questions && questions.length > 0 ? (
        <QuestionsList questions={questions} />
      ) : (
        <p className="text-gray-600">No questions found.</p>
      )}
    </div>
  );
};

