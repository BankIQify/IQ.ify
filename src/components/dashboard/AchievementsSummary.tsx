
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Medal, Trophy, Star } from "lucide-react";
import { Trophy as TrophyComponent } from "@/components/ui/child-friendly/Trophy";

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
    <Card className="h-full bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-700">Achievements Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border border-blue-200 transform transition-transform hover:scale-105">
              <div className="p-2 bg-blue-200 rounded-full mb-2">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{achievements.testsCompleted}</div>
              <div className="text-sm text-center text-blue-600">Tests Completed</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border border-green-200 transform transition-transform hover:scale-105">
              <div className="p-2 bg-green-200 rounded-full mb-2">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">{achievements.averageScore}%</div>
              <div className="text-sm text-center text-green-600">Average Score</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg border border-amber-200 transform transition-transform hover:scale-105">
              <div className="p-2 bg-amber-200 rounded-full mb-2">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-amber-700">{achievements.perfectScores}</div>
              <div className="text-sm text-center text-amber-600">Perfect Scores</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg border border-purple-200 transform transition-transform hover:scale-105">
              <div className="p-2 bg-purple-200 rounded-full mb-2">
                <Medal className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">#{achievements.leaderboardPosition}</div>
              <div className="text-sm text-center text-purple-600">Leaderboard Rank</div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-blue-100">
            <h3 className="font-medium mb-2 text-blue-700">Recent Milestones</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-md border border-blue-100">
                <Award className="h-4 w-4 text-green-500" />
                <span>Completed 15+ practice tests</span>
              </li>
              <li className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-md border border-blue-100">
                <Award className="h-4 w-4 text-blue-500" />
                <span>Maintained 80%+ average for a month</span>
              </li>
              <li className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded-md border border-blue-100">
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
