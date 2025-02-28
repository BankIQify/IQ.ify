
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourPuzzle } from "./types";
import type { Database } from "@/integrations/supabase/types";

export const fetchTwentyFourPuzzles = async (difficulty: Difficulty): Promise<TwentyFourPuzzle[]> => {
  try {
    // Define the limit based on difficulty
    const limitMap = {
      easy: 5,
      medium: 8,
      hard: 10
    };
    
    const limit = limitMap[difficulty] || 5;
    
    // Use the new challenges table instead of game_puzzles
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) {
      return data.map((item) => {
        // Map from challenges table format to our app's format
        return {
          id: item.id.toString(),
          numbers: [item.number1, item.number2, item.number3, item.number4],
          solution: item.solution,
        };
      });
    } else {
      console.log("No puzzles found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return [];
  }
};

// Function to record a completed game session
export const recordGameSession = async (score: number, durationSeconds: number): Promise<void> => {
  try {
    // Use a database-compatible game type
    const gameType: Database["public"]["Enums"]["game_type"] = "word_scramble"; // Using word_scramble as a fallback
    
    const { error } = await supabase
      .from("game_sessions")
      .insert({
        game_type: gameType,
        score,
        duration_seconds: durationSeconds,
        completed_at: new Date().toISOString()
      });
      
    if (error) throw error;
  } catch (error) {
    console.error("Error recording game session:", error);
  }
};
