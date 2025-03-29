import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../../src/types/supabase.ts";

const BATCH_SIZE = 50; // Generate 50 puzzles per theme/difficulty

interface WordSearchPuzzle {
  grid: string[][];
  words: string[];
  dimensions: {
    rows: number;
    cols: number;
  };
}

interface Theme {
  id: string;
  name: string;
}

type Difficulty = 'easy' | 'moderate' | 'challenging';

function generateWordSearchPuzzle(difficulty: Difficulty, theme: string): WordSearchPuzzle {
  // Import your existing puzzle generation logic here
  // This is a placeholder that should be replaced with your actual generation code
  return {
    grid: [["A", "B"], ["C", "D"]],
    words: ["TEST"],
    dimensions: { rows: 2, cols: 2 }
  };
}

serve(async (req: Request) => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

    // Get all themes
    const { data: themes, error: themesError } = await supabaseClient
      .from('game_themes')
      .select('id, name');

    if (themesError) throw themesError;
    if (!themes) throw new Error('No themes found');

    const difficulties: Difficulty[] = ['easy', 'moderate', 'challenging'];
    const puzzles: Array<{
      theme_id: string;
      difficulty: Difficulty;
      grid: string[][];
      words: string[];
      dimensions: { rows: number; cols: number };
    }> = [];

    // Generate puzzles for each theme and difficulty
    for (const theme of themes) {
      for (const difficulty of difficulties) {
        // Check how many unused puzzles we have for this combination
        const { count, error: countError } = await supabaseClient
          .from('word_search_puzzles')
          .select('*', { count: 'exact', head: true })
          .eq('theme_id', theme.id)
          .eq('difficulty', difficulty)
          .is('used_at', null);

        if (countError) throw countError;

        // Generate more if we have less than 20 unused puzzles
        if ((count ?? 0) < 20) {
          console.log(`Generating puzzles for theme: ${theme.name}, difficulty: ${difficulty}`);
          
          for (let i = 0; i < BATCH_SIZE; i++) {
            const puzzle = generateWordSearchPuzzle(difficulty, theme.name);
            puzzles.push({
              theme_id: theme.id,
              difficulty,
              grid: puzzle.grid,
              words: puzzle.words,
              dimensions: puzzle.dimensions
            });
          }
        }
      }
    }

    if (puzzles.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('word_search_puzzles')
        .insert(puzzles);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        puzzlesGenerated: puzzles.length
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}); 