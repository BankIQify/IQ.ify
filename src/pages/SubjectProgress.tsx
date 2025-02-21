
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SubjectProgress = () => {
  const { subject } = useParams();
  
  const { data: progressData } = useQuery({
    queryKey: ['subject-progress', subject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('subject', subject);
      
      if (error) throw error;
      return data;
    }
  });

  const subTopics = {
    verbal: [
      { name: 'Vocabulary', progress: 75 },
      { name: 'Comprehension', progress: 82 },
      { name: 'Word Relationships', progress: 68 },
    ],
    non_verbal: [
      { name: 'Pattern Recognition', progress: 70 },
      { name: 'Spatial Reasoning', progress: 65 },
      { name: 'Logical Sequences', progress: 78 },
    ],
    brain_training: [
      { name: 'Memory', progress: 85 },
      { name: 'Speed', progress: 72 },
      { name: 'Accuracy', progress: 80 },
    ],
  };

  const getSubjectTitle = (subject: string) => {
    const titles = {
      verbal: 'Verbal Reasoning',
      non_verbal: 'Non-Verbal Reasoning',
      brain_training: 'Brain Training',
    };
    return titles[subject as keyof typeof titles] || subject;
  };

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-education-600 to-education-800 bg-clip-text text-transparent">
        {getSubjectTitle(subject || '')} Progress
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subject && subTopics[subject as keyof typeof subTopics]?.map((topic, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-pastel-blue/10">
            <h3 className="text-xl font-semibold mb-4 text-education-800">{topic.name}</h3>
            <Progress value={topic.progress} className="mb-2" />
            <p className="text-sm text-gray-600">
              Progress: {topic.progress}%
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectProgress;
