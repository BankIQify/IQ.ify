
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { RawPuzzleData, WordSearchPuzzle } from "../types";
import { toast } from "@/components/ui/use-toast";

export const fetchThemes = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const { data, error } = await supabase
      .from("game_themes")
      .select("id, name")
      .order("name");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching themes:", error);
    toast({
      title: "Error",
      description: "Failed to load puzzle themes.",
    });
    return [];
  }
};

export const fetchPuzzlesByTheme = async (themeId: string, difficulty: Difficulty): Promise<WordSearchPuzzle[]> => {
  try {
    const { data, error } = await supabase
      .from("game_puzzles")
      .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
      .eq("theme_id", themeId)
      .eq("difficulty", difficulty)
      .eq("game_type", "word_search");

    if (error) throw error;
    
    // Transform the data to match our expected format
    const formattedPuzzles: WordSearchPuzzle[] = (data || []).map((raw: RawPuzzleData) => {
      // Safely parse the puzzle_data which is Json type from database
      const puzzleData = typeof raw.puzzle_data === 'string' 
        ? JSON.parse(raw.puzzle_data) 
        : raw.puzzle_data;
        
      return {
        id: raw.id,
        theme_id: raw.theme_id,
        difficulty: raw.difficulty,
        puzzle_data: puzzleData,
        theme: {
          name: raw.game_themes.name
        }
      };
    });
    
    return formattedPuzzles;
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    toast({
      title: "Error",
      description: "Failed to load puzzles.",
    });
    return [];
  }
};
