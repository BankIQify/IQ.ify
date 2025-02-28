
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { CrosswordPuzzle, RawPuzzleData } from "../types";
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

export const getDifficultyConfig = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return { 
        minWordLength: 3, 
        maxWordLength: 5,
        minWordCount: 5,
        maxWordCount: 8
      };
    case "medium":
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10
      };
    case "hard":
      return { 
        minWordLength: 5, 
        maxWordLength: 10,
        minWordCount: 8,
        maxWordCount: 15
      };
    default:
      return { 
        minWordLength: 4, 
        maxWordLength: 6,
        minWordCount: 6,
        maxWordCount: 10
      };
  }
};

export const fetchPuzzlesByTheme = async (
  themeId: string, 
  difficulty: Difficulty
): Promise<CrosswordPuzzle[]> => {
  try {
    const { data, error } = await supabase
      .from("game_puzzles")
      .select("id, theme_id, difficulty, puzzle_data, game_themes(name)")
      .eq("theme_id", themeId)
      .eq("difficulty", difficulty)
      .eq("game_type", "crossword");

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
        puzzle_data: puzzleData as CrosswordPuzzleData,
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
    toast({
      title: "Error",
      description: "Failed to load puzzles.",
    });
    return [];
  }
};
