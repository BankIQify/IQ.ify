import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickerBook } from '@/components/achievements/StickerBook';
import { MedalWall } from '@/components/achievements/MedalWall';
import { TrophyCabinet } from '@/components/achievements/TrophyCabinet';
import { AchievementUnlockAlert } from '@/components/achievements/AchievementUnlockAlert';
import { useAchievements } from '@/hooks/useAchievements';
import type { AchievementUnlockAlert as AlertType } from '@/types/achievements/types';

export const AchievementsTab = () => {
  const [activeTab, setActiveTab] = useState('stickers');
  const [alert, setAlert] = useState<AlertType | null>(null);
  const { achievements, userAchievements } = useAchievements();

  return (
    <div className="space-y-6">
      {/* Achievement Unlock Alert */}
      {alert && (
        <AchievementUnlockAlert
          alert={alert}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Achievement Sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start h-12">
          <TabsTrigger value="stickers">
            Sticker Book
          </TabsTrigger>
          <TabsTrigger value="medals">
            Medal Wall
          </TabsTrigger>
          <TabsTrigger value="trophies">
            Trophy Cabinet
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stickers" className="mt-6">
          <StickerBook
            achievements={achievements}
            userAchievements={userAchievements}
          />
        </TabsContent>

        <TabsContent value="medals" className="mt-6">
          <MedalWall
            achievements={achievements}
            userAchievements={userAchievements}
          />
        </TabsContent>

        <TabsContent value="trophies" className="mt-6">
          <TrophyCabinet
            achievements={achievements}
            userAchievements={userAchievements}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
