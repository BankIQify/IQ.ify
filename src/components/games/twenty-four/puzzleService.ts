
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourPuzzle } from "./types";
import type { Database } from "@/integrations/supabase/types";

export const fetchTwentyFourPuzzles = async (difficulty: Difficulty): Promise<TwentyFourPuzzle[]> => {
  try {
    console.log(`Fetching twenty-four puzzles with difficulty: ${difficulty}`);
    
    // Define the limit based on difficulty
    const limitMap = {
      easy: 5,
      medium: 8,
      hard: 10
    };
    
    const limit = limitMap[difficulty] || 5;
    
    // We'll define complexity ranges for each difficulty level
    // Complexity can be determined by the maximum number in the set
    // Easy: numbers from 1-5
    // Medium: numbers from 1-9
    // Hard: numbers from 1-13
    
    let maxNumber = 5; // Default for easy
    
    if (difficulty === 'medium') {
      maxNumber = 9;
    } else if (difficulty === 'hard') {
      maxNumber = 13;
    }
    
    // Use the challenges table with a filter based on difficulty
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      // For difficulty filtering, we'll use the maximum number in each set
      .or(`number1.lte.${maxNumber},number2.lte.${maxNumber},number3.lte.${maxNumber},number4.lte.${maxNumber}`)
      .limit(limit);

    if (error) {
      console.error("Supabase error fetching puzzles:", error);
      throw error;
    }

    console.log(`Received ${data?.length || 0} puzzles from database`);

    if (data && data.length > 0) {
      // Process the puzzle data and assign an appropriate difficulty
      return data.map((item) => {
        return {
          id: item.id.toString(),
          numbers: [item.number1, item.number2, item.number3, item.number4],
          solution: item.solution,
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

// Function to record a completed game session
export const recordGameSession = async (score: number, durationSeconds: number): Promise<void> => {
  try {
    // Use the correct game_type enum value for 24 game
    const gameType: Database["public"]["Enums"]["game_type"] = "number_sequence"; // Using number_sequence as the closest match
    
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

// Add a function to generate sample puzzle data
export const generateSamplePuzzles = async (): Promise<any[]> => {
  try {
    // Sample puzzles for different difficulty levels
    const samplePuzzles = [
      // Easy puzzles (small numbers)
      { number1: 1, number2: 2, number3: 3, number4: 4, solution: "((1+2)+3)*4 = 24" },
      { number1: 2, number2: 2, number3: 2, number4: 3, solution: "2*(2*(2+3)) = 24" },
      { number1: 2, number2: 3, number3: 3, number4: 4, solution: "2*3*4 = 24" },
      { number1: 1, number2: 3, number3: 4, number4: 5, solution: "(5-1)*(4+3) = 24" },
      { number1: 2, number2: 2, number3: 4, number4: 6, solution: "6*4/(2+2) = 24" },
      { number1: 3, number2: 3, number3: 3, number4: 3, solution: "3*3*3-3 = 24" },
      { number1: 2, number2: 3, number3: 4, number4: 5, solution: "2*3*4 = 24" },
      
      // Medium puzzles (medium numbers)
      { number1: 3, number2: 5, number3: 7, number4: 9, solution: "3*(5+9-7) = 24" },
      { number1: 4, number2: 6, number3: 7, number4: 8, solution: "(8-4)*(7-6) = 24" },
      { number1: 2, number2: 6, number3: 8, number4: 9, solution: "(9-6)*(8/2) = 24" },
      { number1: 5, number2: 6, number3: 7, number4: 8, solution: "(8-5)*(7+6) = 24" },
      { number1: 4, number2: 4, number3: 7, number4: 8, solution: "(7-4/4)*8 = 24" },
      { number1: 3, number2: 6, number3: 8, number4: 9, solution: "(9-8+3)*6 = 24" },
      { number1: 5, number2: 5, number3: 7, number4: 9, solution: "(9-5)*(7-5) = 24" },
      
      // Hard puzzles (larger numbers and more complex operations)
      { number1: 5, number2: 8, number3: 11, number4: 13, solution: "(13-11)*(8+5) = 24" },
      { number1: 6, number2: 6, number3: 8, number4: 13, solution: "((13-8)*6)/6 = 24" },
      { number1: 7, number2: 9, number3: 10, number4: 13, solution: "(13-10)*(9+7) = 24" },
      { number1: 4, number2: 9, number3: 10, number4: 13, solution: "(13-9)*(10-4) = 24" },
      { number1: 5, number2: 7, number3: 11, number4: 12, solution: "(12-7)*(11-5) = 24" },
      { number1: 3, number2: 8, number3: 9, number4: 13, solution: "(13-9)*(8-3) = 24" },
      { number1: 4, number2: 7, number3: 11, number4: 12, solution: "(12-7)*(11-4) = 24" },
    ];
    
    console.log("Attempting to insert sample puzzles into the database");
    
    // Check if there are already puzzles in the challenges table
    const { data: existingPuzzles, error: countError } = await supabase
      .from("challenges")
      .select("id", { count: 'exact' });
      
    if (countError) {
      console.error("Error checking existing puzzles:", countError);
      throw countError;
    }
    
    if (existingPuzzles && existingPuzzles.length > 0) {
      console.log(`Found ${existingPuzzles.length} existing puzzles, skipping sample generation`);
      return existingPuzzles;
    }
    
    // Insert the sample puzzles into the challenges table
    const { data, error } = await supabase
      .from("challenges")
      .insert(samplePuzzles)
      .select();
      
    if (error) {
      console.error("Error inserting sample puzzles:", error);
      throw error;
    }
    
    console.log("Sample puzzles generated successfully:", data?.length || 0);
    return data || [];
  } catch (error) {
    console.error("Error generating sample puzzles:", error);
    throw error;
  }
};
