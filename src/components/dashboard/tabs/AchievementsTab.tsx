
import { UserBadges } from "@/components/dashboard/UserBadges";
import { AchievementsSummary } from "@/components/dashboard/AchievementsSummary";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, Crown, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const AchievementsTab = () => {
  // Mock data for leaderboard
  const leaderboardData = [
    { rank: 1, name: "Alex Johnson", avatar: null, score: 4350, isUser: false },
    { rank: 2, name: "Sarah Williams", avatar: null, score: 4120, isUser: false },
    { rank: 3, name: "David Chen", avatar: null, score: 3980, isUser: false },
    { rank: 4, name: "Emma Davis", avatar: null, score: 3870, isUser: false },
    { rank: 5, name: "You", avatar: null, score: 3740, isUser: true },
  ];

  // Mock data for achievement milestones
  const milestoneData = {
    currentLevel: 12,
    nextLevel: 13,
    progress: 68,
    pointsToNext: 120,
    totalPoints: 3740,
  };

  // Mock data for streaks
  const streakData = {
    current: 4,
    longest: 15,
    thisWeek: 4,
    lastWeek: 7,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserBadges />
        <AchievementsSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Achievement Milestones</CardTitle>
            <CardDescription>Your journey to mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center h-12 w-12 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full text-white">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-lg">Level {milestoneData.currentLevel}</div>
                    <div className="text-sm text-muted-foreground">Intermediate Reasoner</div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-right">
                      <div className="font-bold text-amber-600">{milestoneData.totalPoints}</div>
                      <div className="text-xs text-muted-foreground">Total Points</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {milestoneData.nextLevel}</span>
                    <span className="font-medium">{milestoneData.progress}%</span>
                  </div>
                  <Progress value={milestoneData.progress} className="h-2" />
                  <div className="text-xs text-right text-muted-foreground">
                    {milestoneData.pointsToNext} points needed
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border text-center">
                  <div className="flex justify-center mb-1">
                    <Medal className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold">18</div>
                  <div className="text-xs text-muted-foreground">Tests Completed</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border text-center">
                  <div className="flex justify-center mb-1">
                    <Trophy className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold">82%</div>
                  <div className="text-xs text-muted-foreground">Average Score</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border text-center">
                  <div className="flex justify-center mb-1">
                    <Crown className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Perfect Scores</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border text-center">
                  <div className="flex justify-center mb-1">
                    <Zap className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Current Level</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Streaks</CardTitle>
            <CardDescription>Consistency builds success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-lg font-bold">{streakData.current} Days</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`p-2 rounded-md ${i < streakData.thisWeek ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <div className="text-xs">{['M','T','W','T','F','S','S'][i]}</div>
                    {i < streakData.thisWeek && <div className="text-xs mt-1">✓</div>}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Longest Streak</span>
                  <span className="font-medium">{streakData.longest} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Week</span>
                  <span className="font-medium">{streakData.lastWeek}/7 days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>See how you compare to other learners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboardData.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center p-3 rounded-md ${user.isUser ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'} transition-colors`}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 mr-3 font-medium">
                  {user.rank}
                </div>
                <Avatar className="h-10 w-10 mr-3">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.isUser ? 'You' : `Rank #${user.rank}`}
                  </div>
                </div>
                <div className="font-bold">{user.score}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-center text-muted-foreground">
            Leaderboard updates weekly based on test scores and activity
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
