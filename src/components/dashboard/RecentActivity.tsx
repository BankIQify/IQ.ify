
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthContext } from "@/contexts/AuthContext";
import { Brain } from "lucide-react";

export const RecentActivity = () => {
  const { user } = useAuthContext();

  // Mock data for brain training games only (no exams)
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
    },
    { 
      id: 3, 
      name: "Word Search", 
      completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      score: 78
    },
    { 
      id: 4, 
      name: "Sudoku Master", 
      completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      score: 89
    }
  ];

  // Define the activity type with a proper interface
  type ActivityItem = {
    id: number | string;
    type: 'game';
    name: string;
    date: Date;
    score: number;
  };

  // Use only game activities since we don't save exams
  const activities: ActivityItem[] = mockGames.map(game => ({
    id: game.id,
    type: 'game' as const,
    name: game.name,
    date: new Date(game.completedAt),
    score: game.score
  })).sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  const getActivityIcon = (type: string) => {
    // Only games are shown now
    return <Brain className="h-4 w-4 text-purple-500" />;
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
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={`${activity.type}-${activity.id}`} className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{activity.score}%</div>
                  <div className="text-xs text-muted-foreground">Game Score</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm">Complete some brain games to see your activity here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
