import { useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

interface ActivityStyle {
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}

export const useActivityTracking = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const trackActivity = useCallback(async (
    title: string,
    path: string,
    styles: ActivityStyle
  ) => {
    if (!user) return;

    try {
      // Check if activity exists
      const { data: existingActivity } = await supabase
        .from('user_activities')
        .select('id, access_count')
        .eq('user_id', user.id)
        .eq('path', path)
        .single();

      if (existingActivity) {
        // Update existing activity count
        await supabase
          .from('user_activities')
          .update({ 
            access_count: (existingActivity.access_count || 0) + 1,
            last_accessed: new Date().toISOString()
          })
          .eq('id', existingActivity.id);
      } else {
        // Create new activity
        await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            title,
            path,
            icon: styles.icon,
            gradient_from: styles.gradientFrom,
            gradient_to: styles.gradientTo,
            border_color: styles.borderColor,
            text_color: styles.textColor,
            icon_color: styles.iconColor,
            access_count: 1
          });
      }

      // Invalidate quick actions query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['quickActions', user.id] });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user, queryClient]);

  return { trackActivity };
}; 