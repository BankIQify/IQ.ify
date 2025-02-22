
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

interface SubTopic {
  id: string;
  name: string;
  section_id: string;
}

const ManageExams = () => {
  const { toast } = useToast();
  const [standardCategory, setStandardCategory] = useState<QuestionCategory | ''>('');
  const [customName, setCustomName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<QuestionCategory[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [topicSelectorOpen, setTopicSelectorOpen] = useState(false);

  // Fetch sections and sub-topics
  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_sections')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subTopics } = useQuery({
    queryKey: ['sub_topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_topics')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateStandardExam = async () => {
    if (!standardCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('exams')
        .insert({
          name: `Standard ${standardCategory.replace('_', ' ')} Test`,
          category: standardCategory,
          question_count: 20,
          is_standard: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Standard exam created successfully"
      });

      setStandardCategory('');
    } catch (error) {
      console.error('Error creating standard exam:', error);
      toast({
        title: "Error",
        description: "Failed to create standard exam",
        variant: "destructive"
      });
    }
  };

  const handleTopicSelection = (topic: QuestionCategory) => {
    setSelectedTopics(prev => {
      if (prev.includes(topic)) {
        // Remove topic and its associated sub-topics
        setSelectedSubTopics(current => 
          current.filter(subTopicId => {
            const subTopic = subTopics?.find(st => st.id === subTopicId);
            const section = sections?.find(s => s.id === subTopic?.section_id);
            return section?.category !== topic;
          })
        );
        return prev.filter(t => t !== topic);
      } else {
        // Check if trying to combine Brain Training with VR/NVR
        if (topic === 'brain_training' && prev.some(t => t === 'verbal' || t === 'non_verbal')) {
          toast({
            title: "Error",
            description: "Brain Training cannot be combined with Verbal or Non-Verbal Reasoning",
            variant: "destructive"
          });
          return prev;
        }
        if ((topic === 'verbal' || topic === 'non_verbal') && prev.includes('brain_training')) {
          toast({
            title: "Error",
            description: "Verbal and Non-Verbal Reasoning cannot be combined with Brain Training",
            variant: "destructive"
          });
          return prev;
        }
        return [...prev, topic];
      }
    });
  };

  const handleCreateCustomExam = async () => {
    if (!customName || selectedTopics.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (questionCount < 10 || questionCount > 40) {
      toast({
        title: "Error",
        description: "Question count must be between 10 and 40",
        variant: "destructive"
      });
      return;
    }

    if (timeLimit && (timeLimit < 1 || timeLimit > 120)) {
      toast({
        title: "Error",
        description: "Time limit must be between 1 and 120 minutes",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create the exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          name: customName,
          category: selectedTopics[0], // Primary category
          question_count: questionCount,
          time_limit_minutes: timeLimit,
          is_standard: false
        })
        .select()
        .single();

      if (examError) throw examError;

      // If sub-topics are selected, create exam_sub_topics entries
      if (selectedSubTopics.length > 0) {
        const examSubTopicsData = selectedSubTopics.map(subTopicId => ({
          exam_id: exam.id,
          sub_topic_id: subTopicId
        }));

        const { error: subTopicsError } = await supabase
          .from('exam_sub_topics')
          .insert(examSubTopicsData);

        if (subTopicsError) throw subTopicsError;
      }

      toast({
        title: "Success",
        description: "Custom exam created successfully"
      });

      // Reset form
      setCustomName("");
      setSelectedTopics([]);
      setSelectedSubTopics([]);
      setQuestionCount(20);
      setTimeLimit(undefined);
    } catch (error) {
      console.error('Error creating custom exam:', error);
      toast({
        title: "Error",
        description: "Failed to create custom exam",
        variant: "destructive"
      });
    }
  };

  const availableSubTopics = subTopics?.filter(subTopic => {
    const section = sections?.find(s => s.id === subTopic.section_id);
    return section && selectedTopics.includes(section.category as QuestionCategory);
  }) || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Exams</h1>
      
      <Tabs defaultValue="standard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="standard">Standard Exams</TabsTrigger>
          <TabsTrigger value="custom">Custom Exams</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="standardCategory">Category</Label>
                <Select 
                  value={standardCategory} 
                  onValueChange={(value: QuestionCategory) => setStandardCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verbal">Verbal Reasoning</SelectItem>
                    <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
                    <SelectItem value="brain_training">Brain Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreateStandardExam} className="w-full">
                Create Standard Exam
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="customName">Exam Name</Label>
                <Input
                  id="customName"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Enter exam name"
                />
              </div>

              <div className="space-y-2">
                <Label>Topics</Label>
                <Popover open={topicSelectorOpen} onOpenChange={setTopicSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={topicSelectorOpen}
                      className="w-full justify-between"
                    >
                      {selectedTopics.length === 0
                        ? "Select topics..."
                        : `${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} selected`}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search topics..." />
                      <CommandEmpty>No topics found.</CommandEmpty>
                      <CommandGroup>
                        {['verbal', 'non_verbal', 'brain_training'].map((topic) => (
                          <CommandItem
                            key={topic}
                            value={topic}
                            onSelect={() => handleTopicSelection(topic as QuestionCategory)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTopics.includes(topic as QuestionCategory) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {topic.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {availableSubTopics.length > 0 && (
                <div className="space-y-2">
                  <Label>Sub-topics (Optional)</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableSubTopics.map((subTopic) => (
                      <div key={subTopic.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={subTopic.id}
                          checked={selectedSubTopics.includes(subTopic.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubTopics([...selectedSubTopics, subTopic.id]);
                            } else {
                              setSelectedSubTopics(selectedSubTopics.filter(id => id !== subTopic.id));
                            }
                          }}
                          className="h-4 w-4"
                        />
                        <label htmlFor={subTopic.id} className="text-sm">
                          {subTopic.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="questionCount">Number of Questions (10-40)</Label>
                <Input
                  id="questionCount"
                  type="number"
                  min="10"
                  max="40"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes, optional)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="1"
                  max="120"
                  value={timeLimit || ""}
                  onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Enter time limit (1-120 minutes)"
                />
              </div>

              <Button onClick={handleCreateCustomExam} className="w-full">
                Create Custom Exam
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageExams;

