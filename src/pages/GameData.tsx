import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameStats {
  totalGames: number;
  activePlayers: number;
  averageScore: number;
  completionRate: number;
  dailyActiveUsers: number;
  averageSessionTime: number;
}

export default function GameData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    activePlayers: 0,
    averageScore: 0,
    completionRate: 0,
    dailyActiveUsers: 0,
    averageSessionTime: 0
  });

  const handleDataRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_stats')
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        const stats: GameStats = {
          totalGames: Number(data.total_games) || 0,
          activePlayers: Number(data.active_players) || 0,
          averageScore: Number(data.average_score) || 0,
          completionRate: Number(data.completion_rate) || 0,
          dailyActiveUsers: Number(data.daily_active_users) || 0,
          averageSessionTime: Number(data.average_session_time) || 0
        };
        setGameStats(stats);
      }
      
      toast({
        title: "Success",
        description: "Game data refreshed successfully",
      });
    } catch (error) {
      console.error('Error refreshing game data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh game data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Game Analytics</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Game Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Total Games: {gameStats.totalGames}</p>
                <p>Active Players: {gameStats.activePlayers}</p>
                <p>Average Score: {gameStats.averageScore}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Daily Active Users: {gameStats.dailyActiveUsers}</p>
                <p>Average Session Time: {gameStats.averageSessionTime} min</p>
                <p>Completion Rate: {gameStats.completionRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDataRefresh}
                  disabled={loading}
                  className="w-full mb-2"
                >
                  {loading ? "Refreshing..." : "Refresh Data"}
                </Button>
                <Button className="w-full mb-2" variant="outline">Export Analytics</Button>
                <Button className="w-full" variant="secondary">Configure Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Performance charts coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Engagement charts coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 