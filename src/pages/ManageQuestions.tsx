
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionGenerator } from "@/components/questions/QuestionGenerator";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { supabase } from "@/integrations/supabase/client";

export type QuestionContent = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl?: string;
};

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

type Question = {
  id: string;
  content: QuestionContent;
  sub_topics: {
    name: string;
  };
};

const ManageQuestions = () => {
  const [category, setCategory] = useState<QuestionCategory>('verbal');
  const [subTopicId, setSubTopicId] = useState<string>("");

  // Fetch sub-topics based on selected category
  const { data: subTopics } = useQuery({
    queryKey: ['subTopics', category],
    queryFn: async () => {
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
    }
  });

  // Fetch existing questions
  const { data: rawQuestions, isLoading } = useQuery({
    queryKey: ['questions', subTopicId],
    queryFn: async () => {
      if (!subTopicId) return [];

      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          sub_topics (
            name
          )
        `)
        .eq('sub_topic_id', subTopicId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!subTopicId,
  });

  // Transform raw questions to match our frontend type
  const questions: Question[] = (rawQuestions || []).map(q => ({
    id: q.id,
    content: q.content as QuestionContent,
    sub_topics: q.sub_topics
  }));

  return (
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="generate">
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: QuestionCategory) => {
                    setCategory(value);
                    setSubTopicId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                    <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                    <SelectItem value="brain_training">Brain Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subTopic">Sub-topic</Label>
                <Select
                  value={subTopicId}
                  onValueChange={setSubTopicId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {subTopics?.map((subTopic) => (
                      <SelectItem key={subTopic.id} value={subTopic.id}>
                        {subTopic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <QuestionGenerator 
                subTopicId={subTopicId} 
                category={category}
              />
            </div>
          </Card>

          {!subTopicId ? (
            <p className="text-gray-600">Select a sub-topic to view questions</p>
          ) : isLoading ? (
            <p>Loading questions...</p>
          ) : questions && questions.length > 0 ? (
            <QuestionsList questions={questions} />
          ) : (
            <p className="text-gray-600">No questions generated yet.</p>
          )}
        </TabsContent>

        <TabsContent value="manual">
          <Card className="p-6 mb-8">
            <ManualQuestionUpload subTopicId={subTopicId} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageQuestions;
