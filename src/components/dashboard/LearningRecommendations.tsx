import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type MainSubject, type SubTopicPerformance } from "@/types/performance/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface LearningRecommendationsProps {
  className?: string;
}

interface SubtopicData {
  name: string;
  subject: {
    name: string;
  };
}

interface PerformanceWithSubtopic extends SubTopicPerformance {
  subtopic: SubtopicData;
}

const subjectInfo = {
  verbal_reasoning: {
    icon: "📚",
    color: "from-blue-50 to-indigo-50 border-blue-200 hover:shadow-blue-100",
    textColor: "text-blue-800"
  },
  non_verbal_reasoning: {
    icon: "🧩",
    color: "from-purple-50 to-pink-50 border-purple-200 hover:shadow-purple-100",
    textColor: "text-purple-800"
  },
  brain_training: {
    icon: "🧠",
    color: "from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-emerald-100",
    textColor: "text-emerald-800"
  }
} as const;

export const LearningRecommendations = ({ className }: LearningRecommendationsProps) => {
  const { user } = useAuth();

  const { data: performanceData, isLoading } = useQuery<PerformanceWithSubtopic[]>({
    queryKey: ['subtopicPerformance', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('subtopic_performance')
        .select(`
          id,
          user_id,
          subtopic_id,
          average_score,
          total_attempts,
          last_attempt_at,
          created_at,
          updated_at,
          subtopic:sub_topics (
            name,
            subject:subjects (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('average_score', { ascending: true })
        .limit(5);

      if (error) throw error;
      
      return (data || []).map(item => {
        const subtopicData = item.subtopic as unknown as SubtopicData;
        return {
          id: item.id as string,
          user_id: item.user_id as string,
          subtopic_id: item.subtopic_id as string,
          average_score: item.average_score as number,
          total_attempts: item.total_attempts as number,
          last_attempt_at: item.last_attempt_at as string,
          created_at: item.created_at as string,
          updated_at: item.updated_at as string,
          subtopic: {
            name: subtopicData?.name || 'Unknown',
            subject: {
              name: subtopicData?.subject?.name || 'Unknown'
            }
          }
        };
      });
    },
    enabled: !!user?.id,
  });

  const subjectPerformance = useMemo(() => {
    if (!performanceData) return {};

    return performanceData.reduce((acc, performance) => {
      const subjectName = performance.subtopic?.subject?.name || 'Unknown';
      if (!acc[subjectName]) {
        acc[subjectName] = { total: 0, count: 0 };
      }
      acc[subjectName].total += performance.average_score;
      acc[subjectName].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);
  }, [performanceData]);

  const weakSubjects = Object.entries(subjectPerformance)
    .map(([subject, { total, count }]) => ({
      subject: subject as MainSubject,
      averageScore: total / count,
    }))
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (!weakSubjects.length) {
    return null;
  }

  return (
    <Card className={cn(className, "animate-in fade-in duration-700")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <span>Areas for Improvement</span>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weakSubjects.map(({ subject, averageScore }, index) => {
            const info = subjectInfo[subject];
            return (
              <div
                key={subject}
                className={cn(
                  "flex items-center justify-between",
                  "p-3 rounded-lg border",
                  "bg-gradient-to-r",
                  "transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  info.color,
                  "animate-in fade-in-50 slide-in-from-left-5",
                  { "delay-150": index === 1, "delay-300": index === 2 }
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-label={subject}>
                    {info.icon}
                  </span>
                  <div>
                    <h4 className={cn("font-medium capitalize", info.textColor)}>
                      {subject.replace(/_/g, ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Average Score: {averageScore.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <Link to={`/practice/${subject}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "transition-all duration-300",
                      "hover:bg-white/50 hover:text-foreground"
                    )}
                  >
                    Practice Now
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
        <Button asChild variant="outline" className="w-full mt-4">
          <Link to="/practice">Start Practicing</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
