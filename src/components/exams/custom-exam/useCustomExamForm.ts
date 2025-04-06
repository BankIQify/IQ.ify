import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

interface Section {
  id: string;
  category: QuestionCategory;
}

interface SubTopic {
  id: string;
  section_id: string;
}

export function useCustomExamForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [customName, setCustomName] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<QuestionCategory[]>([]);
  const [selectedSubTopics, setSelectedSubTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [topicSelectorOpen, setTopicSelectorOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create exams",
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

    setIsLoading(true);

    try {
      console.log('Creating custom exam:', { 
        name: customName, 
        category: selectedTopics[0],
        userId: user.id,
        subTopics: selectedSubTopics
      });

      // Create the exam
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .insert({
          name: customName,
          category: selectedTopics[0], // Primary category
          question_count: questionCount,
          time_limit_minutes: timeLimit,
          is_standard: false,
          created_by: user.id
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
    } catch (error: any) {
      console.error('Error creating custom exam:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create custom exam",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customName,
    setCustomName,
    selectedTopics,
    selectedSubTopics,
    setSelectedSubTopics,
    questionCount,
    setQuestionCount,
    timeLimit,
    setTimeLimit,
    topicSelectorOpen,
    setTopicSelectorOpen,
    handleTopicSelection,
    handleCreateCustomExam,
    isLoading
  };
}
