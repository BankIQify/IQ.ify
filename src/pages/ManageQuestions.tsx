
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionGenerator } from "@/components/questions/QuestionGenerator";
import { ManualQuestionUpload } from "@/components/questions/ManualQuestionUpload";
import { QuestionsList } from "@/components/questions/QuestionsList";
import { CategoryManager } from "@/components/questions/CategoryManager";
import { supabase } from "@/integrations/supabase/client";
import { CompleteQuestionBank } from "@/components/questions/CompleteQuestionBank";

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

  // Fetch questions based on selected sub-topic
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
          sub_topics (
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
        content: q.content as QuestionContent,
        sub_topics: q.sub_topics
      }));
    },
    enabled: !!subTopicId,
  });

  const isLoading = isLoadingSubTopics || isLoadingQuestions;

  return (
    <div className="page-container">
      <h1 className="section-title">Question Management</h1>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate Questions</TabsTrigger>
          <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
          <TabsTrigger value="bank">Complete Question Bank</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoryManager />
        </TabsContent>

        <TabsContent value="bank">
          <CompleteQuestionBank />
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
                  disabled={isLoadingSubTopics}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingSubTopics ? "Loading..." : "Select sub-topic"} />
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
            <p className="text-gray-600">Loading questions...</p>
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

