import { useState, useEffect } from 'react';
import { HeroContent, HeroContentUpdate } from '../types/hero';
import { createBrowserClient } from '@supabase/ssr';

export const useHeroContent = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let mounted = true;

    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .single();

        if (error) {
          throw new Error(`Failed to fetch hero content: ${error.message}`);
        }

        if (mounted) {
          setHeroContent(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hero content';
        if (mounted) {
          setError(errorMessage);
          console.error('Error fetching hero content:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchHeroContent();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const updateHeroContent = async (updates: HeroContentUpdate): Promise<HeroContent> => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('hero_content')
        .update(updates)
        .eq('id', 'default')
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update hero content: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned after update');
      }

      setHeroContent(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update hero content';
      setError(errorMessage);
      console.error('Error updating hero content:', err);
      throw err;
    }
  };

  return {
    heroContent,
    loading,
    error,
    updateHeroContent,
  };
}; 