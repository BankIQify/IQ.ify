import type { Json } from '@/types/supabase';

export type AchievementType = 'sticker' | 'medal' | 'trophy';
export type AchievementTier = 'bronze' | 'silver' | 'gold';
export type AchievementCategory = 
  | 'general'
  | 'verbal_reasoning'
  | 'non_verbal_reasoning'
  | 'brain_training'
  | 'daily_streaks'
  | 'quiz_mastery'
  | 'game_master';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: AchievementType;
  visual_asset: string;
  category?: string;
  requirements?: Json;
  created_at: string;
  updated_at: string;
  tier?: AchievementTier;
  unlock_condition?: {
    type: 'count' | 'streak' | 'score';
    target: number;
    metric: string;
  };
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked: boolean;
  progress: {
    current: number;
    target: number;
  };
  created_at: string;
  updated_at: string;
  achievement?: Achievement;
}

export interface AchievementStreak {
  id: string;
  user_id: string;
  streak_type: string;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
}

export interface AchievementUnlockAlert {
  type: AchievementType;
  achievement: Achievement;
  tier?: AchievementTier;
  timestamp: string;
} 