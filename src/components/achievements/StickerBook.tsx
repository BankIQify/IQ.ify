import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Achievement, UserAchievement } from '@/types/achievements/types';

interface StickerBookProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  className?: string;
}

const STICKER_CHAPTERS = [
  { 
    id: 'general',
    name: 'Getting Started',
    bgColor: 'from-pink-50/50 to-purple-50/50',
    icon: '🌟'
  },
  { 
    id: 'quiz_mastery',
    name: 'Quiz Master',
    bgColor: 'from-amber-50/50 to-yellow-50/50',
    icon: '📚'
  },
  { 
    id: 'daily_streaks',
    name: 'Daily Rewards',
    bgColor: 'from-emerald-50/50 to-teal-50/50',
    icon: '🔥'
  }
];

export const StickerBook = ({ achievements, userAchievements, className }: StickerBookProps) => {
  const [activeChapter, setActiveChapter] = useState(STICKER_CHAPTERS[0].id);

  // Filter sticker achievements
  const stickerAchievements = achievements.filter(a => a.type === 'sticker');
  const achievementMap = new Map(
    userAchievements.map(ua => [ua.achievement_id, ua])
  );

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs value={activeChapter} onValueChange={setActiveChapter}>
        <TabsList className="w-full justify-start h-12">
          {STICKER_CHAPTERS.map(chapter => (
            <TabsTrigger
              key={chapter.id}
              value={chapter.id}
              className="flex items-center gap-2"
            >
              <span className="text-xl">{chapter.icon}</span>
              {chapter.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {STICKER_CHAPTERS.map(chapter => {
          const chapterStickers = stickerAchievements.filter(
            sticker => sticker.category === chapter.id
          );

          if (chapterStickers.length === 0) return null;

          return (
            <TabsContent
              key={chapter.id}
              value={chapter.id}
            >
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r rounded-3xl opacity-40 -z-10",
                  chapter.bgColor
                )} />
                
                <div className="px-8 py-6">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <span className="text-3xl">{chapter.icon}</span>
                    {chapter.name}
                  </h3>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8">
                    {chapterStickers.map(sticker => {
                      const userAchievement = achievementMap.get(sticker.id);
                      const isUnlocked = userAchievement?.unlocked ?? false;
                      const progress = userAchievement?.progress ?? { current: 0, target: sticker.unlock_condition.target };
                      const progressPercentage = Math.min(100, (progress.current / progress.target) * 100);

                      return (
                        <TooltipProvider key={sticker.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="group relative">
                                {/* Sticker Container */}
                                <div className={cn(
                                  "relative aspect-square flex items-center justify-center",
                                  "transition-all duration-300 transform",
                                  "cursor-help hover:scale-110",
                                  isUnlocked ? "hover:-translate-y-2" : "hover:-translate-y-1"
                                )}>
                                  {/* Sticker Image */}
                                  <img
                                    src={sticker.visual_asset}
                                    alt={sticker.title}
                                    className={cn(
                                      "w-full h-full object-contain transition-all duration-300",
                                      !isUnlocked && "opacity-75 filter brightness-75"
                                    )}
                                  />

                                  {/* Glow Effect for Unlocked Stickers */}
                                  {isUnlocked && (
                                    <div className="absolute inset-0 -z-10">
                                      <div className="absolute inset-0 animate-pulse">
                                        <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-2xl" />
                                        <div className="absolute inset-0 bg-pink-200/10 rounded-full blur-xl animate-ping" />
                                      </div>
                                    </div>
                                  )}

                                  {/* Lock Indicator */}
                                  {!isUnlocked && (
                                    <div className="absolute top-2 right-2 text-xl opacity-50">
                                      🔒
                                    </div>
                                  )}
                                </div>

                                {/* Sticker Title */}
                                <div className="text-center mt-4">
                                  <h4 className={cn(
                                    "font-semibold text-lg transition-colors duration-300",
                                    isUnlocked ? "text-purple-700" : "text-gray-600"
                                  )}>
                                    {sticker.title}
                                  </h4>
                                </div>
                              </div>
                            </TooltipTrigger>

                            <TooltipContent 
                              side="top" 
                              className="max-w-xs bg-black/90 text-white border-none shadow-xl"
                              sideOffset={8}
                            >
                              <div className="space-y-2 p-3">
                                <h4 className="font-semibold text-white/90">{sticker.title}</h4>
                                <p className="text-sm text-white/70">{sticker.description}</p>
                                {!isUnlocked && (
                                  <div className="mt-3 pt-2 border-t border-white/20">
                                    <div className="text-xs text-white/60">
                                      Progress: {progress.current}/{progress.target}
                                    </div>
                                    <div className="h-1.5 bg-white/20 rounded-full mt-1.5">
                                      <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progressPercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}; 