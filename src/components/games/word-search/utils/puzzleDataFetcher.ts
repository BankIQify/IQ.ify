
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
    
    // More descriptive error message for network failures
    const errorMessage = error instanceof Error && error.message.includes("network") 
      ? "Network connection error. Please check your internet connection and try again."
      : "Failed to load puzzle themes.";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return [];
  }
};

export const fetchPuzzlesByTheme = async (themeId: string, difficulty: Difficulty): Promise<WordSearchPuzzle[]> => {
  try {
    // Add timeout for fetch operations
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 10000);
    });

    const fetchPromise = supabase
      .from("game_puzzles")
      .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
      .eq("theme_id", themeId)
      .eq("difficulty", difficulty)
      .eq("game_type", "word_search");

    // Use Promise.race to implement the timeout
    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise
    ]) as Awaited<ReturnType<typeof fetchPromise>>;

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
    
    // More descriptive error messages based on the type of error
    let errorMessage = "Failed to load puzzles.";
    
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        errorMessage = "Request timed out. Please try again later.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network connection error. Please check your internet connection.";
      } else if (error.message.includes("permission") || error.message.includes("not authorized")) {
        errorMessage = "You don't have permission to access these puzzles.";
      }
    }
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return [];
  }
};
