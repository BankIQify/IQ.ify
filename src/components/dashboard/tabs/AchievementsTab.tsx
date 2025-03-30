import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Medal, Trophy, BadgeCheck, Star, Brain } from "lucide-react";
import { StickerBook } from '@/components/achievements/StickerBook';
import { MedalWall } from '@/components/achievements/MedalWall';
import { TrophyCabinet } from '@/components/achievements/TrophyCabinet';
import { useAchievements } from '@/hooks/useAchievements';
import type { AchievementUnlockAlert as AlertType } from '@/types/achievements/types';
import { AchievementUnlockAlert } from '@/components/achievements/AchievementUnlockAlert';

export const AchievementsTab = () => {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const { achievements, userAchievements } = useAchievements();

  // Sample stickers data
  const stickers = [
    { id: '1', name: 'First Login', imageUrl: '/stickers/login.png', unlocked: true, theme: 'space', task: 'Log in for the first time', chapter: 1 },
    { id: '2', name: 'Brain Trainer', imageUrl: '/stickers/brain.png', unlocked: true, theme: 'space', task: 'Complete your first brain training game', chapter: 1 },
    { id: '3', name: 'Quiz Whiz', imageUrl: '/stickers/quiz.png', unlocked: false, theme: 'space', task: 'Score over 50% on a quiz', chapter: 1 },
    // Add more stickers as needed
  ];

  // Sample medals data
  const medals = [
    { 
      id: '1', 
      name: 'Quiz Champion', 
      description: 'Complete all subtopics in a subject',
      tier: 'gold' as const,
      unlocked: true 
    },
    { 
      id: '2', 
      name: 'Brain Master', 
      description: 'Reach 80% accuracy in 5 different quizzes',
      tier: 'silver' as const,
      unlocked: false,
      progress: { current: 3, target: 5 }
    },
    { 
      id: '3', 
      name: 'Practice Makes Perfect', 
      description: 'Practice for a total of 5 hours',
      tier: 'bronze' as const,
      unlocked: false,
      progress: { current: 2, target: 5 }
    },
    // Add more medals as needed
  ];

  // Sample trophies data
  const trophies = [
    {
      id: '1',
      name: 'Dedication Master',
      description: 'Log in every day for a month',
      imageUrl: '/trophies/dedication.png',
      unlocked: true,
      rarity: 'legendary' as const
    },
    {
      id: '2',
      name: 'Perfect Score',
      description: 'Achieve 100% in an entire subject area',
      imageUrl: '/trophies/perfect.png',
      unlocked: false,
      rarity: 'rare' as const,
      progress: { current: 85, target: 100 }
    },
    {
      id: '3',
      name: 'Game Master',
      description: 'Play 50 brain training games',
      imageUrl: '/trophies/games.png',
      unlocked: false,
      rarity: 'common' as const,
      progress: { current: 25, target: 50 }
    },
    // Add more trophies as needed
  ];

  return (
    <div className="space-y-8">
      {/* Achievement Unlock Alert */}
      {alert && (
        <AchievementUnlockAlert
          alert={alert}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Overview Card */}
      <Card className="card-iqify card-iqify-blue">
        <CardHeader>
          <CardTitle className="text-xl text-iqify-navy">Your Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-iqify-blue/10 to-iqify-blue/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-iqify-blue">{stickers.filter(s => s.unlocked).length}</div>
              <div className="text-sm text-muted-foreground">Stickers Collected</div>
            </div>
            <div className="bg-gradient-to-br from-iqify-yellow/10 to-iqify-yellow/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-iqify-yellow">{medals.filter(m => m.unlocked).length}</div>
              <div className="text-sm text-muted-foreground">Medals Earned</div>
            </div>
            <div className="bg-gradient-to-br from-iqify-green/10 to-iqify-green/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-iqify-green">{trophies.filter(t => t.unlocked).length}</div>
              <div className="text-sm text-muted-foreground">Trophies Won</div>
            </div>
            <div className="bg-gradient-to-br from-iqify-pink/10 to-iqify-pink/30 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-iqify-pink">
                {stickers.filter(s => s.unlocked).length +
                 medals.filter(m => m.unlocked).length +
                 trophies.filter(t => t.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Total Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sticker Book */}
      <StickerBook stickers={stickers} />

      {/* Medal Wall */}
      <MedalWall medals={medals} />

      {/* Trophy Cabinet */}
      <TrophyCabinet trophies={trophies} />
    </div>
  );
};
