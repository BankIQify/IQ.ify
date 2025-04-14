import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Highlight {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_visible: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const useHighlightsContent = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('highlights')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      setHighlights(data || []);
    } catch (err) {
      console.error('Error fetching highlights:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch highlights');
    } finally {
      setLoading(false);
    }
  };

  const updateHighlight = async (id: string, updates: Partial<Highlight>) => {
    try {
      const { error } = await supabase
        .from('highlights')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setHighlights(highlights.map(highlight => 
        highlight.id === id ? { ...highlight, ...updates } : highlight
      ));
    } catch (err) {
      console.error('Error updating highlight:', err);
      setError(err instanceof Error ? err.message : 'Failed to update highlight');
    }
  };

  const deleteHighlight = async (id: string) => {
    try {
      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHighlights(highlights.filter(highlight => highlight.id !== id));
    } catch (err) {
      console.error('Error deleting highlight:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete highlight');
    }
  };

  return {
    highlights,
    loading,
    error,
    updateHighlight,
    deleteHighlight
  };
}; 