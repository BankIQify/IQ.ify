import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { type SubjectType } from '@/types/performance/types';

export const useSubjectPerformance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updatePerformance = useCallback(async (
    subject: SubjectType,
    score: number
  ) => {
    if (!user || score < 0 || score > 100) return;

    try {
      // Call the database function to update performance
      const { error } = await supabase.rpc('update_subject_performance', {
        p_user_id: user.id,
        p_subject: subject,
        p_score: score
      });

      if (error) throw error;

      // Invalidate the performance query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['subjectPerformance', user.id] });
    } catch (error) {
      console.error('Error updating subject performance:', error);
    }
  }, [user, queryClient]);

  return { updatePerformance };
}; 