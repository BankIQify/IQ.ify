import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Achievement, UserAchievement, AchievementStreak } from '@/types/achievements/types';

export const useAchievements = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // Fetch all achievements
  const { data: achievements = [] } = useQuery({
    queryKey: ['achievements'] as const,
    queryFn: async () => {
      console.log('Fetching achievements...');
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching achievements:', error);
        return [] as Achievement[];
      }

      console.log('Fetched achievements:', data);
      return (data || []) as Achievement[];
    }
  });

  // Fetch user's achievements
  const { data: userAchievements = [] } = useQuery({
    queryKey: ['userAchievements', user?.id] as const,
    queryFn: async () => {
      if (!user) return [] as UserAchievement[];

      console.log('Fetching user achievements for:', user.id);
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching user achievements:', error);
        return [] as UserAchievement[];
      }

      console.log('Fetched user achievements:', data);
      return (data || []) as UserAchievement[];
    },
    enabled: !!user
  });

  // Fetch user's streaks
  const { data: streaks = [] } = useQuery({
    queryKey: ['achievementStreaks', user?.id] as const,
    queryFn: async () => {
      if (!user) return [] as AchievementStreak[];

      const { data, error } = await supabase
        .from('achievement_streaks')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return (data || []) as AchievementStreak[];
    },
    enabled: !!user
  });

  // Update achievement progress
  const updateProgress = useCallback(async (
    achievementId: string,
    progress: { current: number; target: number }
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('update_achievement_progress', {
        p_user_id: user.id,
        p_achievement_id: achievementId,
        p_progress: progress
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userAchievements', user.id] });
    } catch (error) {
      console.error('Error updating achievement progress:', error);
    }
  }, [user, queryClient]);

  // Update streak
  const updateStreak = useCallback(async (
    streakType: string,
    increment: boolean = true
  ) => {
    if (!user) return;

    try {
      const { data: existingStreak } = await supabase
        .from('achievement_streaks')
        .select('*')
        .eq('user_id', user.id)
        .eq('streak_type', streakType)
        .single();

      const now = new Date();
      const lastActivity = existingStreak?.last_activity_at 
        ? new Date(existingStreak.last_activity_at)
        : null;

      // Check if streak should be reset (more than 24 hours since last activity)
      const shouldReset = lastActivity && 
        (now.getTime() - lastActivity.getTime() > 24 * 60 * 60 * 1000);

      const newStreak = shouldReset ? 1 : (existingStreak?.current_streak || 0) + (increment ? 1 : 0);

      await supabase
        .from('achievement_streaks')
        .upsert({
          user_id: user.id,
          streak_type: streakType,
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, existingStreak?.longest_streak || 0),
          last_activity_at: now.toISOString()
        });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['achievementStreaks', user.id] });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user, queryClient]);

  return {
    achievements,
    userAchievements,
    streaks,
    updateProgress,
    updateStreak,
    isLoading: false, // We'll add proper loading states later
    error: null
  };
}; 