import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Achievement, UserAchievement } from '@/types/achievements/types';

interface MedalWallProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  className?: string;
}

const MEDAL_CATEGORIES = [
  {
    id: 'quiz_mastery',
    name: 'Quiz Mastery',
    color: 'from-amber-50/50 to-yellow-50/50',
    icon: '⚡'
  },
  {
    id: 'verbal_reasoning',
    name: 'Verbal Reasoning',
    color: 'from-blue-50/50 to-indigo-50/50',
    icon: '📚'
  },
  {
    id: 'non_verbal_reasoning',
    name: 'Non-Verbal Reasoning',
    color: 'from-purple-50/50 to-pink-50/50',
    icon: '🎯'
  },
  {
    id: 'brain_training',
    name: 'Brain Training',
    color: 'from-emerald-50/50 to-teal-50/50',
    icon: '🧠'
  },
  {
    id: 'daily_streaks',
    name: 'Daily Streaks',
    color: 'from-amber-50/50 to-yellow-50/50',
    icon: '🔥'
  }
];

export const MedalWall = ({ achievements, userAchievements, className }: MedalWallProps) => {
  // Filter medal achievements
  const medalAchievements = achievements.filter(a => a.type === 'medal');
  const achievementMap = new Map(
    userAchievements.map(ua => [ua.achievement_id, ua])
  );

  return (
    <div className={cn("space-y-12", className)}>
      {MEDAL_CATEGORIES.map(category => {
        const categoryMedals = medalAchievements.filter(
          medal => medal.category === category.id
        );

        if (categoryMedals.length === 0) return null;

        return (
          <div key={category.id} className="relative">
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r rounded-3xl opacity-40 -z-10",
              category.color
            )} />
            
            <div className="px-8 py-6">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                {category.name}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {categoryMedals.map(medal => {
                  const userAchievement = achievementMap.get(medal.id);
                  const isUnlocked = userAchievement?.unlocked ?? false;
                  const progress = userAchievement?.progress ?? { current: 0, target: medal.unlock_condition.target };
                  const progressPercentage = Math.min(100, (progress.current / progress.target) * 100);

                  return (
                    <TooltipProvider key={medal.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group relative">
                            {/* Medal Container */}
                            <div className={cn(
                              "relative aspect-square flex items-center justify-center",
                              "transition-all duration-300 transform",
                              "cursor-help hover:scale-105",
                              isUnlocked ? "hover:-translate-y-2" : "hover:-translate-y-1"
                            )}>
                              {/* Medal Image */}
                              <img
                                src={medal.visual_asset}
                                alt={medal.title}
                                className={cn(
                                  "w-full h-full object-contain transition-all duration-300",
                                  !isUnlocked && "opacity-75 filter brightness-75"
                                )}
                              />

                              {/* Glow Effect for Unlocked Medals */}
                              {isUnlocked && (
                                <div className="absolute inset-0 -z-10">
                                  <div className="absolute inset-0 animate-pulse">
                                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-2xl" />
                                    <div className="absolute inset-0 bg-yellow-200/10 rounded-full blur-xl animate-ping" />
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

                            {/* Medal Title */}
                            <div className="text-center mt-4">
                              <h4 className={cn(
                                "font-semibold text-lg transition-colors duration-300",
                                isUnlocked ? "text-yellow-700" : "text-gray-600"
                              )}>
                                {medal.title}
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
                            <h4 className="font-semibold text-white/90">{medal.title}</h4>
                            <p className="text-sm text-white/70">{medal.description}</p>
                            {!isUnlocked && (
                              <div className="mt-3 pt-2 border-t border-white/20">
                                <div className="text-xs text-white/60">
                                  Progress: {progress.current}/{progress.target}
                                </div>
                                <div className="h-1.5 bg-white/20 rounded-full mt-1.5">
                                  <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300"
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
        );
      })}
    </div>
  );
}; 