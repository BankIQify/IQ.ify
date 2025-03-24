
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Medal, Trophy, Star } from "lucide-react";

export const AchievementsSummary = () => {
  // Mock data - in a real app this would come from an API
  const achievements = {
    testsCompleted: 18,
    averageScore: 82,
    perfectScores: 3,
    badges: 4,
    leaderboardPosition: 12
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full mb-2">
                <Trophy className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{achievements.testsCompleted}</div>
              <div className="text-sm text-center text-muted-foreground">Tests Completed</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full mb-2">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{achievements.averageScore}%</div>
              <div className="text-sm text-center text-muted-foreground">Average Score</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-amber-100 rounded-full mb-2">
                <Star className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{achievements.perfectScores}</div>
              <div className="text-sm text-center text-muted-foreground">Perfect Scores</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full mb-2">
                <Medal className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">#{achievements.leaderboardPosition}</div>
              <div className="text-sm text-center text-muted-foreground">Leaderboard Rank</div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Recent Milestones</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-green-500" />
                <span>Completed 15+ practice tests</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-blue-500" />
                <span>Maintained 80%+ average for a month</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Earned "Perfect Score" badge</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
