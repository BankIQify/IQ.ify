import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { type MainSubject } from '@/types/performance/types';

interface SubtopicPerformance {
  id: string;
  name: string;
  main_subject: MainSubject;
  averageScore: number;
  totalAttempts: number;
  mainSubjectInfo: {
    icon: string;
    color: string;
  };
}

interface DatabaseSubtopic {
  id: string;
  name: string;
  main_subject: MainSubject;
}

interface DatabasePerformance {
  subtopic: DatabaseSubtopic;
  average_score: number;
  total_attempts: number;
}

const mainSubjectInfo = {
  verbal_reasoning: {
    icon: '📚',
    color: 'text-blue-500',
  },
  non_verbal_reasoning: {
    icon: '🧩',
    color: 'text-purple-500',
  },
  brain_training: {
    icon: '🧠',
    color: 'text-green-500',
  },
} as const;

interface WeakSubtopicsProps {
  className?: string;
}

export const WeakSubtopics = ({ className }: WeakSubtopicsProps) => {
  const { user } = useAuth();
  const [weakSubtopics, setWeakSubtopics] = useState<SubtopicPerformance[]>([]);

  useEffect(() => {
    const fetchWeakSubtopics = async () => {
      if (!user) return;

      try {
        const { data: performance, error } = await supabase
          .from('subtopic_performance')
          .select(`
            subtopic:subtopics (
              id,
              name,
              main_subject
            ),
            average_score,
            total_attempts
          `)
          .eq('user_id', user.id)
          .order('average_score', { ascending: true })
          .limit(5);

        if (error) throw error;

        if (!performance) return;

        // Map performance data to weak subtopics with type assertion
        const typedPerformance = performance as unknown as DatabasePerformance[];
        const mappedSubtopics: SubtopicPerformance[] = typedPerformance.map(perf => ({
          id: perf.subtopic.id,
          name: perf.subtopic.name,
          main_subject: perf.subtopic.main_subject,
          averageScore: perf.average_score,
          totalAttempts: perf.total_attempts,
          mainSubjectInfo: mainSubjectInfo[perf.subtopic.main_subject]
        }));

        setWeakSubtopics(mappedSubtopics);
      } catch (error) {
        console.error('Error fetching weak subtopics:', error);
      }
    };

    fetchWeakSubtopics();
  }, [user]);

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>Areas for Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weakSubtopics.map((subtopic) => (
            <div
              key={subtopic.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{subtopic.mainSubjectInfo.icon}</span>
                <div>
                  <p className="font-medium">{subtopic.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {subtopic.totalAttempts} attempts
                  </p>
                </div>
              </div>
              <div className={cn("font-medium", subtopic.mainSubjectInfo.color)}>
                {subtopic.averageScore}%
              </div>
            </div>
          ))}
          {weakSubtopics.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Complete some practice tests to see your areas for improvement.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 