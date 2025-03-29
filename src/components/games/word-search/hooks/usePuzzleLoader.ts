import { useState, useEffect } from "react";
import { generateWordSearchPuzzle } from "../utils/puzzleGenerator";
import type { Difficulty } from "@/components/games/GameSettings";
import type { WordToFind, GridDimensions } from "../types";
import { supabase } from '@/integrations/supabase/client';

export const usePuzzleLoader = (difficulty: Difficulty, themeId: string) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPuzzle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to get a pre-generated puzzle
      const { data: puzzle, error: fetchError } = await supabase
        .from('word_search_puzzles')
        .select('*')
        .eq('theme_id', themeId)
        .eq('difficulty', difficulty)
        .is('used_at', null)
        .limit(1)
        .single();

      if (fetchError) {
        // If no pre-generated puzzle is available, generate one on the fly
        console.log('No pre-generated puzzle available, generating one...');
        const generatedPuzzle = generateWordSearchPuzzle(difficulty, themeId);
        setGrid(generatedPuzzle.grid);
        setWords(generatedPuzzle.words);
        return;
      }

      // Mark the puzzle as used
      await supabase
        .from('word_search_puzzles')
        .update({ used_at: new Date().toISOString() })
        .eq('id', puzzle.id);

      setGrid(puzzle.grid);
      setWords(puzzle.words);
    } catch (err) {
      console.error('Error loading puzzle:', err);
      setError(err instanceof Error ? err.message : 'Failed to load puzzle');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [difficulty, themeId]);

  const handleNewPuzzle = () => {
    fetchPuzzle();
  };

  return {
    grid,
    words,
    isLoading,
    error,
    handleNewPuzzle,
  };
};
