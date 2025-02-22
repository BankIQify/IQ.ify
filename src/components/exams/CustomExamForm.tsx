
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TopicSelector } from "./TopicSelector";
import { SubTopicSelector } from "./SubTopicSelector";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

interface SubTopic {
  id: string;
  name: string;
  section_id: string;
}

export function CustomExamForm() {
  const { toast } = useToast();
  const [customName, setCustomName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<QuestionCategory[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [topicSelectorOpen, setTopicSelectorOpen] = useState(false);

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

  const handleSubTopicChange = (subTopicId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubTopics([...selectedSubTopics, subTopicId]);
    } else {
      setSelectedSubTopics(selectedSubTopics.filter(id => id !== subTopicId));
    }
  };

  return (
    <div className="space-y-4">
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
        <TopicSelector
          selectedTopics={selectedTopics}
          onTopicSelection={handleTopicSelection}
          open={topicSelectorOpen}
          onOpenChange={setTopicSelectorOpen}
        />
      </div>

      <SubTopicSelector
        availableSubTopics={availableSubTopics}
        selectedSubTopics={selectedSubTopics}
        onSubTopicChange={handleSubTopicChange}
      />

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
    </div>
  );
}
