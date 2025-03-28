import { useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { type ActivityType, type QuickAction } from '@/types/activity/types';

export const useTrackActivity = () => {
  const { user } = useAuthContext();

  const trackActivity = useCallback(async (
    type: ActivityType,
    title: string,
    path: string,
    styles: {
      icon: string;
      gradientFrom: string;
      gradientTo: string;
      borderColor: string;
      textColor: string;
      iconColor: string;
    }
  ) => {
    if (!user) return;

    try {
      // Check if activity exists
      const { data: existingActivity } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .eq('path', path)
        .single();

      if (existingActivity) {
        // Update existing activity
        await supabase
          .from('user_activities')
          .update({})  // Empty update triggers the access_count increment
          .eq('id', existingActivity.id);
      } else {
        // Create new activity
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            type,
            title,
            path,
            icon: styles.icon,
            gradient_from: styles.gradientFrom,
            gradient_to: styles.gradientTo,
            border_color: styles.borderColor,
            text_color: styles.textColor,
            icon_color: styles.iconColor
          });
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  return { trackActivity };
}; 