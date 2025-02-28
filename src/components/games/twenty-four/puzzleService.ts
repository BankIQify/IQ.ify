
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourPuzzle, TwentyFourGameType } from "./types";
import { useToast } from "@/hooks/use-toast";

export const fetchTwentyFourPuzzles = async (difficulty: Difficulty): Promise<TwentyFourPuzzle[]> => {
  try {
    const gameType: TwentyFourGameType = "twenty_four";
    
    const { data, error } = await supabase
      .from("game_puzzles")
      .select("id, puzzle_data")
      .eq("game_type", gameType)
      .eq("difficulty", difficulty)
      .limit(10);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map((item) => {
        const puzzleData = typeof item.puzzle_data === 'string' ? 
          JSON.parse(item.puzzle_data) : item.puzzle_data;
          
        return {
          id: item.id,
          numbers: puzzleData.numbers || [],
          solution: puzzleData.solution,
        };
      });
    } else {
      console.log("No puzzles found for difficulty:", difficulty);
      return [];
    }
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return [];
  }
};
