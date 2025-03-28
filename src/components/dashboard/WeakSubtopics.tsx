import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type MainSubject, type WeakSubTopic } from "@/types/performance/types";

// Map of main subjects to their display info
const mainSubjectInfo: Record<MainSubject, {
  icon: any;
  iconColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  verbal_reasoning: {
    icon: BookOpen,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },
  non_verbal_reasoning: {
    icon: Target,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },
  brain_training: {
    icon: Zap,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200"
  }
};

interface WeakSubtopicsProps {
  className?: string;
}

export const WeakSubtopics = ({ className }: WeakSubtopicsProps) => {
  const { user } = useAuthContext();

  const { data: weakSubtopics = [] } = useQuery<WeakSubTopic[]>({
    queryKey: ['weakSubtopics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        // Fetch all subtopics with performance below 50%
        const { data: performance, error } = await supabase
          .from('subtopic_performance')
          .select(`
            *,
            subtopic:subtopics (
              id,
              name,
              main_subject,
              description,
              path
            )
          `)
          .eq('user_id', user.id)
          .lt('average_score', 50) // Only get scores below 50%
          .order('average_score', { ascending: true })
          .limit(3);

        if (error) throw error;

        // If no weak performance data, fetch default subtopics
        if (!performance || performance.length === 0) {
          const { data: defaultSubtopics, error: subtopicsError } = await supabase
            .from('subtopics')
            .select('*')
            .limit(3);

          if (subtopicsError) throw subtopicsError;

          return (defaultSubtopics || []).map(subtopic => ({
            ...subtopic,
            averageScore: 0,
            totalAttempts: 0,
            mainSubjectInfo: mainSubjectInfo[subtopic.main_subject as MainSubject]
          }));
        }

        // Map performance data to weak subtopics
        return performance.map(perf => ({
          ...perf.subtopic,
          averageScore: perf.average_score,
          totalAttempts: perf.total_attempts,
          mainSubjectInfo: mainSubjectInfo[perf.subtopic.main_subject as MainSubject]
        }));
      } catch (error) {
        console.error('Error fetching weak subtopics:', error);
        return [];
      }
    },
    enabled: !!user
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Areas for Improvement</span>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weakSubtopics.map((subtopic) => {
            const Icon = mainSubjectInfo[subtopic.mainSubject].icon;
            return (
              <div 
                key={subtopic.id} 
                className={`p-3 rounded-md border ${subtopic.mainSubjectInfo.bgColor} flex items-start gap-3`}
              >
                <div className="p-2 rounded-full bg-white">
                  <Icon className={`h-4 w-4 ${subtopic.mainSubjectInfo.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{subtopic.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {subtopic.description}
                    {subtopic.averageScore > 0 && (
                      <span className="ml-2">
                        (Average: {Math.round(subtopic.averageScore)}%)
                      </span>
                    )}
                  </p>
                  <Link to={subtopic.path}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`mt-1 ${subtopic.mainSubjectInfo.textColor} ${subtopic.mainSubjectInfo.borderColor}`}
                    >
                      Practice Now
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 