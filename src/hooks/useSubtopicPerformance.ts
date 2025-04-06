import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { SubtopicPerformance, IconType } from '@/types/subtopics';
import { PostgrestResponse } from '@supabase/supabase-js';

const validIcons = ['target', 'brain', 'book', 'gauge', 'lightbulb', 'trending', 'zap'] as const;

interface RawSubtopicData {
  id: string;
  score: number;
  improvement_suggestions: string | null;
  last_tested: string;
  subtopics: {
    id: string;
    name: string;
    category: string;
    icon: string;
  };
}

const isValidIcon = (icon: string): icon is IconType => {
  return validIcons.includes(icon as IconType);
};

export const useSubtopicPerformance = (examType?: 'custom' | 'standard') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subtopicPerformance', user?.id, examType] as const,
    queryFn: async () => {
      if (!user) return [] as SubtopicPerformance[];

      type Response = PostgrestResponse<RawSubtopicData>;

      const { data: performanceData, error: performanceError } = await supabase
        .from('user_subtopic_performance')
        .select(`
          id,
          score,
          improvement_suggestions,
          last_tested,
          subtopics (
            id,
            name,
            category,
            icon
          )
        `)
        .eq('user_id', user.id)
        .order('last_tested', { ascending: false }) as Response;

      if (performanceError) {
        console.error('Error fetching subtopic performance:', performanceError);
        return [] as SubtopicPerformance[];
      }

      if (!performanceData) return [] as SubtopicPerformance[];

      return performanceData.map(performance => {
        const icon = performance.subtopics.icon;
        if (!isValidIcon(icon)) {
          console.warn(`Invalid icon type: ${icon}, defaulting to 'target'`);
          return {
            id: performance.subtopics.id,
            name: performance.subtopics.name,
            score: performance.score,
            lastTested: new Date(performance.last_tested).toLocaleDateString(),
            improvement: performance.improvement_suggestions || '',
            icon: 'target' as const
          } satisfies SubtopicPerformance;
        }
        
        return {
          id: performance.subtopics.id,
          name: performance.subtopics.name,
          score: performance.score,
          lastTested: new Date(performance.last_tested).toLocaleDateString(),
          improvement: performance.improvement_suggestions || '',
          icon
        } satisfies SubtopicPerformance;
      });
    },
    enabled: !!user
  });
}; 