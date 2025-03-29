import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Medal, Trophy, BadgeCheck, Star, Brain } from "lucide-react";
import { Trophy as TrophyComponent } from "@/components/ui/child-friendly/Trophy";
import { ColorfulBadge } from "@/components/ui/child-friendly/ColorfulBadge";
import { AchievementUnlockAlert } from '@/components/achievements/AchievementUnlockAlert';
import { useAchievements } from '@/hooks/useAchievements';
import type { AchievementUnlockAlert as AlertType } from '@/types/achievements/types';

export const AchievementsTab = () => {
  const [activeTab, setActiveTab] = useState("badges");
  const [alert, setAlert] = useState<AlertType | null>(null);
  const { achievements, userAchievements } = useAchievements();

  // Sample badges data
  const badges = [
    { id: 1, name: "Reading Master", icon: Award, color: "blue", earned: true },
    { id: 2, name: "Math Genius", icon: Brain, color: "green", earned: true },
    { id: 3, name: "Science Whiz", icon: Star, color: "yellow", earned: true },
    { id: 4, name: "Writing Expert", icon: BadgeCheck, color: "pink", earned: true },
    { id: 5, name: "Verbal Reasoning Pro", icon: Medal, color: "purple", earned: false },
    { id: 6, name: "Non-verbal Pro", icon: Trophy, color: "orange", earned: false },
  ];

  // Sample trophies data
  const trophies = [
    { id: 1, name: "Perfect Score", value: "5", description: "Get 100% on any test", color: "gold" },
    { id: 2, name: "Quick Thinker", value: "3", description: "Complete test in record time", color: "silver" },
    { id: 3, name: "Consistent Learner", value: "10", description: "Practice for 10 days in a row", color: "bronze" },
  ];

  // Recent achievements
  const recentAchievements = [
    { id: 1, name: "Reading Comprehension Level 3", date: "2 days ago", points: 50, type: "badge" },
    { id: 2, name: "Completed 10 Math Problems", date: "5 days ago", points: 30, type: "milestone" },
    { id: 3, name: "First Perfect Score", date: "1 week ago", points: 100, type: "trophy" },
  ];

  // Progress towards next achievements
  const upcomingAchievements = [
    { id: 1, name: "Vocabulary Master", progress: 75, total: 100, type: "Complete 100 vocabulary questions" },
    { id: 2, name: "Math Explorer", progress: 40, total: 50, type: "Solve 50 math problems" },
    { id: 3, name: "Perfect Attendance", progress: 12, total: 30, type: "Practice for 30 days" },
  ];

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Alert */}
      {alert && (
        <AchievementUnlockAlert
          alert={alert}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-3 card-iqify card-iqify-blue">
          <CardHeader>
            <CardTitle className="text-xl text-iqify-navy">Your Achievement Progress</CardTitle>
            <CardDescription>
              Track your learning journey and earn cool badges and trophies!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-iqify-blue/10 to-iqify-blue/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-iqify-blue">{badges.filter(b => b.earned).length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
              <div className="bg-gradient-to-br from-iqify-green/10 to-iqify-green/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-iqify-green">{trophies.length}</div>
                <div className="text-sm text-muted-foreground">Trophies Won</div>
              </div>
              <div className="bg-gradient-to-br from-iqify-yellow/10 to-iqify-yellow/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-iqify-yellow">215</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="bg-gradient-to-br from-iqify-pink/10 to-iqify-pink/30 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-iqify-pink">4</div>
                <div className="text-sm text-muted-foreground">Weekly Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:w-1/3">
          <TabsTrigger value="badges" className="text-sm">
            Badges
          </TabsTrigger>
          <TabsTrigger value="trophies" className="text-sm">
            Trophies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <ColorfulBadge
                key={badge.id}
                icon={badge.icon}
                label={badge.name}
                color={badge.color as any}
                earned={badge.earned}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trophies" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trophies.map((trophy) => (
              <TrophyComponent
                key={trophy.id}
                label={trophy.name}
                value={trophy.value}
                description={trophy.description}
                color={trophy.color as any}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-iqify card-iqify-green">
          <CardHeader>
            <CardTitle className="text-lg text-iqify-navy">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentAchievements.map((achievement) => (
                <li key={achievement.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {achievement.type === 'badge' && <BadgeCheck className="h-5 w-5 text-iqify-green" />}
                    {achievement.type === 'trophy' && <Trophy className="h-5 w-5 text-iqify-yellow" />}
                    {achievement.type === 'milestone' && <Star className="h-5 w-5 text-iqify-pink" />}
                    <div>
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.date}</div>
                    </div>
                  </div>
                  <div className="bg-iqify-green/20 text-iqify-green px-2 py-1 rounded-md text-sm font-medium">
                    +{achievement.points} pts
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="card-iqify card-iqify-pink">
          <CardHeader>
            <CardTitle className="text-lg text-iqify-navy">Up Next Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingAchievements.map((achievement) => (
                <li key={achievement.id} className="space-y-2 p-3 bg-white/50 rounded-lg">
                  <div className="flex justify-between">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.progress}/{achievement.total}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{achievement.type}</div>
                  <Progress value={(achievement.progress / achievement.total) * 100} className="h-2 bg-slate-200" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
