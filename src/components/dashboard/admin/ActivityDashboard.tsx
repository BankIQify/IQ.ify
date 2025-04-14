import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ActivitySummary {
  total_users: number;
  active_users: number;
  total_sessions: number;
  average_session_duration: number;
}

interface GameActivity {
  game_name: string;
  total_plays: number;
  average_score: number;
  unique_players: number;
  completion_rate: number;
}

interface ExamActivity {
  exam_type: string;
  total_attempts: number;
  average_score: number;
  pass_rate: number;
  top_subtopics: Array<{
    name: string;
    attempts: number;
    average_score: number;
  }>;
}

export function ActivityDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary | null>(null);
  const [gameActivities, setGameActivities] = useState<GameActivity[]>([]);
  const [examActivities, setExamActivities] = useState<ExamActivity[]>([]);

  useEffect(() => {
    async function fetchActivityData() {
      try {
        setIsLoading(true);

        // Fetch activity summary
        const { data: summaryData, error: summaryError } = await supabase
          .rpc('get_activity_summary');
        
        if (summaryError) throw summaryError;
        setActivitySummary(summaryData[0] as ActivitySummary);

        // Fetch game activities
        const { data: gameData, error: gameError } = await supabase
          .rpc('get_game_activities');
        
        if (gameError) throw gameError;
        setGameActivities(gameData as GameActivity[]);

        // Fetch exam activities
        const { data: examData, error: examError } = await supabase
          .rpc('get_exam_activities');
        
        if (examError) throw examError;
        setExamActivities(examData as ExamActivity[]);
      } catch (error) {
        console.error('Error fetching activity data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch activity data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchActivityData();
    }
  }, [user, toast]);

  if (isLoading) {
    return <div>Loading activity data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySummary?.total_users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySummary?.active_users || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activitySummary?.total_sessions || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activitySummary?.average_session_duration?.toFixed(1) || 0} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Game Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameActivities.map((game) => (
              <Card key={game.game_name}>
                <CardHeader>
                  <CardTitle>{game.game_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>Total Plays: {game.total_plays}</div>
                    <div>Avg. Score: {game.average_score.toFixed(1)}</div>
                    <div>Unique Players: {game.unique_players}</div>
                    <div>Completion Rate: {game.completion_rate.toFixed(1)}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exam Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Exam Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examActivities.map((exam) => (
              <Card key={exam.exam_type}>
                <CardHeader>
                  <CardTitle>{exam.exam_type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div>Total Attempts: {exam.total_attempts}</div>
                      <div>Avg. Score: {exam.average_score.toFixed(1)}</div>
                      <div>Pass Rate: {exam.pass_rate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Top Subtopics</h4>
                      <div className="space-y-1">
                        {exam.top_subtopics.map((subtopic) => (
                          <div key={subtopic.name} className="flex justify-between">
                            <span>{subtopic.name}</span>
                            <span>{subtopic.attempts} attempts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 