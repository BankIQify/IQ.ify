
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

const StandardExam = () => {
  const [category, setCategory] = useState<QuestionCategory>('verbal');

  const createStandardExamMutation = useMutation({
    mutationFn: async () => {
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          name: `Standard ${category.replace('_', ' ')} Test`,
          category,
          question_count: 20,
          is_standard: true,
        })
        .select()
        .single();

      if (examError) throw examError;
      return exam;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Standard exam created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create standard exam",
        variant: "destructive",
      });
    }
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Standard Test</h2>
          <p className="text-gray-600 mb-4">
            Create a standard 20-question exam for one of the three main subjects.
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Select Subject</Label>
            <Select
              value={category}
              onValueChange={(value: QuestionCategory) => setCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                <SelectItem value="brain_training">Brain Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => createStandardExamMutation.mutate()}
            disabled={createStandardExamMutation.isPending}
            className="w-full"
          >
            {createStandardExamMutation.isPending ? "Creating..." : "Create Standard Test"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const CustomExam = () => {
  const [name, setName] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<QuestionCategory[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);

  // Fetch sub-topics for selected categories
  const { data: subTopics, isLoading: isLoadingSubTopics } = useQuery({
    queryKey: ['subTopics', selectedCategories],
    queryFn: async () => {
      if (selectedCategories.length === 0) return [];

      const { data: sections } = await supabase
        .from('question_sections')
        .select('id')
        .in('category', selectedCategories);

      if (!sections?.length) return [];

      const sectionIds = sections.map(section => section.id);

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .in('section_id', sectionIds);

      if (error) throw error;
      return data;
    },
    enabled: selectedCategories.length > 0,
  });

  const createExamMutation = useMutation({
    mutationFn: async () => {
      // First create the exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          name,
          category: selectedCategories[0], // Primary category
          question_count: questionCount,
          time_limit_minutes: timeLimit,
          is_standard: false,
        })
        .select()
        .single();

      if (examError) throw examError;

      // If sub-topics are selected, create the exam sub-topics
      if (selectedSubTopics.length > 0) {
        const examSubTopics = selectedSubTopics.map(subTopicId => ({
          exam_id: exam.id,
          sub_topic_id: subTopicId,
        }));

        const { error: subTopicsError } = await supabase
          .from('exam_sub_topics')
          .insert(examSubTopics);

        if (subTopicsError) throw subTopicsError;
      }

      return exam;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Custom exam created successfully",
      });
      // Reset form
      setName("");
      setQuestionCount(20);
      setTimeLimit(null);
      setSelectedCategories([]);
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

  const handleCreateExam = () => {
    if (!name || !questionCount || selectedCategories.length === 0) {
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
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Custom Exam</h2>
          <p className="text-gray-600 mb-4">
            Create a customized exam by selecting categories, question count, and optional time limit. You can combine VR and NVR topics.
          </p>
        </div>

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
            <Label>Categories (Select up to 2)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verbal"
                  checked={selectedCategories.includes('verbal')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, 'verbal']);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== 'verbal'));
                    }
                  }}
                />
                <Label htmlFor="verbal">Verbal Reasoning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="non_verbal"
                  checked={selectedCategories.includes('non_verbal')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, 'non_verbal']);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== 'non_verbal'));
                    }
                  }}
                />
                <Label htmlFor="non_verbal">Non-Verbal Reasoning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brain_training"
                  checked={selectedCategories.includes('brain_training')}
                  disabled={selectedCategories.length > 0 && !selectedCategories.includes('brain_training')}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories(['brain_training']);
                    } else {
                      setSelectedCategories([]);
                    }
                  }}
                />
                <Label htmlFor="brain_training">Brain Training</Label>
              </div>
            </div>
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

          {selectedCategories.length > 0 && (
            <div>
              <Label>Sub-topics (Optional)</Label>
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
          )}

          <Button 
            onClick={handleCreateExam} 
            disabled={createExamMutation.isPending}
            className="w-full"
          >
            {createExamMutation.isPending ? "Creating..." : "Create Custom Exam"}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ExamList = () => {
  const { data: exams, isLoading } = useQuery({
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

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-semibold">Created Exams</h2>
      {isLoading ? (
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
                {exam.exam_sub_topics.length > 0 && (
                  <div>
                    <p className="font-medium">Sub-topics:</p>
                    <ul className="list-disc list-inside">
                      {exam.exam_sub_topics.map((est: any, index: number) => (
                        <li key={index}>{est.sub_topics.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No exams created yet.</p>
      )}
    </div>
  );
};

const ManageExams = () => {
  return (
    <div className="page-container">
      <h1 className="section-title mb-6">Exam Management</h1>
      
      <Tabs defaultValue="standard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Tests</TabsTrigger>
          <TabsTrigger value="custom">Custom Exams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="standard">
          <StandardExam />
        </TabsContent>
        
        <TabsContent value="custom">
          <CustomExam />
        </TabsContent>
      </Tabs>

      <ExamList />
    </div>
  );
};

export default ManageExams;
