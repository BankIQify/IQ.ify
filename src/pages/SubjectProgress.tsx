
import { useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type QuestionCategory = Database["public"]["Enums"]["question_category"];

interface ExamWithResults {
  name: string;
  category: QuestionCategory;
}

interface ExamResult {
  id: string;
  exam: string;
  score: number;
  created_at: string;
  exams?: ExamWithResults;
}

const SubjectProgress = () => {
  const { subject } = useParams<{ subject: string }>();
  
  const { data: examResults, isLoading } = useQuery({
    queryKey: ['exam-results', subject],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          id,
          exam,
          score,
          created_at,
          exams:exam (
            name,
            category
          )
        `)
        .eq('exams.category', subject as QuestionCategory);
      
      if (error) throw error;
      return data as ExamResult[];
    },
    enabled: !!subject,
  });

  const calculateProgress = () => {
    if (!examResults || examResults.length === 0) return [];
    
    const totalScores: { [key: string]: { total: number; count: number } } = {};
    
    examResults.forEach((result) => {
      if (result.exams) {
        const examName = result.exams.name;
        if (!totalScores[examName]) {
          totalScores[examName] = { total: 0, count: 0 };
        }
        totalScores[examName].total += result.score || 0;
        totalScores[examName].count += 1;
      }
    });

    return Object.entries(totalScores).map(([name, stats]) => ({
      name,
      progress: Math.round((stats.total / stats.count))
    }));
  };

  const getSubjectTitle = (subject: string) => {
    const titles: { [key: string]: string } = {
      verbal: 'Verbal Reasoning',
      non_verbal: 'Non-Verbal Reasoning',
      brain_training: 'Brain Training',
    };
    return titles[subject] || subject;
  };

  const progress = calculateProgress();

  if (!subject) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Please select a subject to view progress
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-education-600 to-education-800 bg-clip-text text-transparent">
        {getSubjectTitle(subject)} Progress
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      ) : progress.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {progress.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-pastel-blue/10">
              <h3 className="text-xl font-semibold mb-4 text-education-800">{item.name}</h3>
              <Progress value={item.progress} className="mb-2" />
              <p className="text-sm text-gray-600">
                Average Score: {item.progress}%
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>No exam results found for this subject.</p>
          <p className="mt-2">Complete some exams to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default SubjectProgress;
