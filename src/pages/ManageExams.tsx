
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

const ManageExams = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<QuestionCategory>('verbal');
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [isStandard, setIsStandard] = useState(false);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);

  // Fetch sub-topics based on selected category
  const { data: subTopics, isLoading: isLoadingSubTopics } = useQuery({
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

  // Create exam mutation
  const createExamMutation = useMutation({
    mutationFn: async () => {
      // First create the exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          name,
          category,
          question_count: questionCount,
          time_limit_minutes: timeLimit,
          is_standard: isStandard,
        })
        .select()
        .single();

      if (examError) throw examError;

      // Then create the exam sub-topics
      const examSubTopics = selectedSubTopics.map(subTopicId => ({
        exam_id: exam.id,
        sub_topic_id: subTopicId,
      }));

      const { error: subTopicsError } = await supabase
        .from('exam_sub_topics')
        .insert(examSubTopics);

      if (subTopicsError) throw subTopicsError;

      return exam;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Exam created successfully",
      });
      // Reset form
      setName("");
      setQuestionCount(20);
      setTimeLimit(null);
      setIsStandard(false);
      setSelectedSubTopics([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create exam",
        variant: "destructive",
      });
    }
  });

  // Fetch existing exams
  const { data: exams, isLoading: isLoadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exams')
        .select(`
          *,
          exam_sub_topics (
            sub_topics (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleCreateExam = () => {
    if (!name || !questionCount || selectedSubTopics.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createExamMutation.mutate();
  };

  return (
    <div className="page-container">
      <h1 className="section-title">Exam Management</h1>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Exam Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter exam name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value: QuestionCategory) => {
                setCategory(value);
                setSelectedSubTopics([]);
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
            <Label htmlFor="questionCount">Number of Questions (10-40)</Label>
            <Input
              id="questionCount"
              type="number"
              min={10}
              max={40}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
            <Input
              id="timeLimit"
              type="number"
              min={1}
              max={120}
              value={timeLimit || ""}
              onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isStandard"
              checked={isStandard}
              onCheckedChange={(checked) => setIsStandard(checked as boolean)}
            />
            <Label htmlFor="isStandard">Standard Exam</Label>
          </div>

          <div>
            <Label>Sub-topics</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {isLoadingSubTopics ? (
                <p>Loading sub-topics...</p>
              ) : subTopics?.map((subTopic) => (
                <div key={subTopic.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subTopic.id}
                    checked={selectedSubTopics.includes(subTopic.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubTopics([...selectedSubTopics, subTopic.id]);
                      } else {
                        setSelectedSubTopics(selectedSubTopics.filter(id => id !== subTopic.id));
                      }
                    }}
                  />
                  <Label htmlFor={subTopic.id}>{subTopic.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleCreateExam} 
            disabled={createExamMutation.isPending}
            className="w-full"
          >
            {createExamMutation.isPending ? "Creating..." : "Create Exam"}
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Created Exams</h2>
        {isLoadingExams ? (
          <p>Loading exams...</p>
        ) : exams && exams.length > 0 ? (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Card key={exam.id} className="p-6">
                <div className="space-y-2">
                  <h3 className="font-medium">{exam.name}</h3>
                  <p>Category: {exam.category.replace('_', ' ')}</p>
                  <p>Questions: {exam.question_count}</p>
                  {exam.time_limit_minutes && (
                    <p>Time Limit: {exam.time_limit_minutes} minutes</p>
                  )}
                  <p>Type: {exam.is_standard ? 'Standard' : 'Custom'}</p>
                  <div>
                    <p className="font-medium">Sub-topics:</p>
                    <ul className="list-disc list-inside">
                      {exam.exam_sub_topics.map((est: any, index: number) => (
                        <li key={index}>{est.sub_topics.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No exams created yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageExams;
