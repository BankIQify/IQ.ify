import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { TopicSelector } from "./TopicSelector";
import { SubTopicSelector } from "./SubTopicSelector";
import { QuestionConfig } from "./custom-exam/QuestionConfig";
import { useCustomExamForm } from "./custom-exam/useCustomExamForm";
import { Skeleton } from "@/components/ui/skeleton";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

interface SubTopic {
  id: string;
  name: string;
  section_id: string;
}

export function CustomExamForm() {
  const {
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
  } = useCustomExamForm();

  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_sections')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: subTopics = [], isLoading: isLoadingSubTopics } = useQuery<SubTopic[]>({
    queryKey: ['sub_topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sub_topics')
        .select('*');
      
      if (error) throw error;
      // Cast to unknown first to satisfy TypeScript
      const typedData = (data || []) as unknown as SubTopic[];
      return typedData;
    }
  });

  const availableSubTopics = subTopics.filter(subTopic => {
    const section = sections.find(s => s.id === subTopic.section_id);
    return section && selectedTopics.includes(section.category as QuestionCategory);
  });

  const handleSubTopicChange = (subTopicId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubTopics([...selectedSubTopics, subTopicId]);
    } else {
      setSelectedSubTopics(selectedSubTopics.filter(id => id !== subTopicId));
    }
  };

  if (isLoadingSections || isLoadingSubTopics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
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

      <QuestionConfig
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        timeLimit={timeLimit}
        setTimeLimit={setTimeLimit}
      />

      <Button 
        onClick={handleCreateCustomExam} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Custom Exam"}
      </Button>
    </div>
  );
}
