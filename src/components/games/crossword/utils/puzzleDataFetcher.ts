
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordPuzzle, CrosswordPuzzleData, RawPuzzleData } from "../types";
import { toast } from "@/components/ui/use-toast";
import { getDifficultyConfig } from "./difficultyConfig";

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

export const fetchPuzzlesByTheme = async (
  themeId: string, 
  difficulty: Difficulty
): Promise<CrosswordPuzzle[]> => {
  try {
    // Check if themeId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(themeId)) {
      console.log(`Theme ID "${themeId}" is not a valid UUID. Using fallback to generate puzzles.`);
      return [];
    }

    // Add timeout for fetch operations
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), 10000);
    });

    const fetchPromise = supabase
      .from("game_puzzles")
      .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
      .eq("theme_id", themeId)
      .eq("difficulty", difficulty)
      .eq("game_type", "crossword");

    // Use Promise.race to implement the timeout
    // Need to use 'as any' to fix TypeScript error with Promise.race and Supabase response
    const { data, error } = await Promise.race([
      fetchPromise as any,
      timeoutPromise
    ]);

    if (error) throw error;
    
    // Transform the data to match our expected format
    const formattedPuzzles: CrosswordPuzzle[] = (data || []).map((raw: RawPuzzleData) => {
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
    
    // Filter puzzles based on word count and word length according to difficulty
    const { minWordLength, maxWordLength, minWordCount, maxWordCount } = getDifficultyConfig(difficulty);
    
    const filteredPuzzles = formattedPuzzles.filter(puzzle => {
      if (!puzzle.puzzle_data || !puzzle.puzzle_data.clues) return false;
      
      const wordCount = puzzle.puzzle_data.clues.length;
      const wordsInRange = puzzle.puzzle_data.clues.filter(clue => {
        const wordLength = clue.answer.length;
        return wordLength >= minWordLength && wordLength <= maxWordLength;
      }).length;
      
      // Check if word count is within range and most words match length requirements
      return wordCount >= minWordCount && 
             wordCount <= maxWordCount && 
             wordsInRange >= wordCount * 0.7; // At least 70% of words should match length criteria
    });
    
    // If we have filtered puzzles, use them; otherwise fallback to all puzzles
    return filteredPuzzles.length > 0 ? filteredPuzzles : formattedPuzzles;
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
