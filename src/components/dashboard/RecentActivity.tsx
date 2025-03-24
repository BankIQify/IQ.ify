
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { Brain, BookOpen, Award, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RecentActivity = () => {
  const { user } = useAuthContext();

  const { data: recentExams, isLoading } = useQuery({
    queryKey: ['recent-exams', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('exam_results')
        .select(`
          id,
          score,
          created_at,
          exam_id,
          exams:exam_id (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Mock data for brain training games
  const mockGames = [
    { 
      id: 1, 
      name: "Crossword Challenge", 
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      score: 85
    },
    { 
      id: 2, 
      name: "Memory Master", 
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      score: 92
    }
  ];

  // Combine and sort recent activities
  const activities = [
    ...(recentExams || []).map((exam) => ({
      id: exam.id,
      type: 'exam',
      name: exam.exams?.name || 'Practice Test',
      date: new Date(exam.created_at),
      score: exam.score,
      category: exam.exams?.category
    })),
    ...mockGames.map(game => ({
      id: game.id,
      type: 'game',
      name: game.name,
      date: new Date(game.completedAt),
      score: game.score
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const getActivityIcon = (type: string, category?: string) => {
    if (type === 'game') return <Brain className="h-4 w-4 text-purple-500" />;
    
    switch(category) {
      case 'verbal':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'non_verbal':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Award className="h-4 w-4 text-amber-500" />;
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <p className="text-muted-foreground">Loading recent activity...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getActivityIcon(activity.type, activity.category)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{activity.score}%</div>
                  <div className="text-xs text-muted-foreground">
                    {activity.type === 'exam' ? 'Exam Score' : 'Game Score'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm">Complete some practice tests or brain games to see your activity here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
