<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { type MainSubject, type SubTopicPerformance } from "@/types/performance/types";
import { cn } from "@/lib/utils";

interface LearningRecommendationsProps {
  className?: string;
}

interface PerformanceWithSubtopic extends SubTopicPerformance {
  subtopic: {
    main_subject: MainSubject;
  };
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
  const { user } = useAuthContext();

  const { data: performance = [] } = useQuery<PerformanceWithSubtopic[]>({
    queryKey: ['subjectPerformance', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('subtopic_performance')
        .select(`
          *,
          subtopic:subtopics (
            main_subject
          )
        `)
        .eq('user_id', user.id)
        .order('average_score', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching subject performance:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user
  });

  // Group performance by main subject and calculate averages
  const subjectAverages = performance.reduce<Record<MainSubject, { total: number; count: number }>>((acc, perf) => {
    const subject = perf.subtopic.main_subject;
    if (!acc[subject]) {
      acc[subject] = { total: 0, count: 0 };
    }
    acc[subject].total += perf.average_score;
    acc[subject].count += 1;
    return acc;
  }, {} as Record<MainSubject, { total: number; count: number }>);

  const weakSubjects = Object.entries(subjectAverages)
    .map(([subject, { total, count }]) => ({
      subject: subject as MainSubject,
      average: total / count
    }))
    .sort((a, b) => a.average - b.average)
    .slice(0, 3);

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
          {weakSubjects.map(({ subject, average }, index) => {
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
                      Average Score: {Math.round(average)}%
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
=======

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const LearningRecommendations = () => {
  // Mock recommendations - in a real app these would be generated based on user performance
  const recommendations = [
    {
      title: "Pattern Recognition Test",
      type: "Non-Verbal Reasoning",
      icon: Target,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      link: "/lets-practice",
    },
    {
      title: "Vocabulary Builder",
      type: "Verbal Reasoning",
      icon: BookOpen,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      link: "/lets-practice",
    },
    {
      title: "Memory Game Challenge",
      type: "Brain Training",
      icon: Zap,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50",
      link: "/brain-training",
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-md border ${rec.bgColor} flex items-start gap-3`}
            >
              <div className="p-2 rounded-full bg-white">
                <rec.icon className={`h-4 w-4 ${rec.iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">{rec.type}</p>
                <Link to={rec.link}>
                  <Button variant="outline" size="sm" className="mt-1">
                    Start Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
        </div>
      </CardContent>
    </Card>
  );
};
