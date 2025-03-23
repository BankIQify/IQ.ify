
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";
import type { Database } from "@/integrations/supabase/types";

export interface GameState {
  score: number;
  timer: number;
  isActive: boolean;
  difficulty: Difficulty;
}

// Define the allowed game types from the database schema
type DatabaseGameType = Database["public"]["Enums"]["game_type"];
type DatabasePuzzleType = Database["public"]["Enums"]["game_puzzle_type"];

// Create a union type for all valid game types
export type GameType = DatabaseGameType | "twenty_four" | "rope_untangle";

interface UseGameStateProps {
  initialTimer?: number;
  gameType: GameType;
  onGameOver?: () => void;
}

export const useGameState = ({
  initialTimer = 300,
  gameType,
  onGameOver,
}: UseGameStateProps) => {
  const [state, setState] = useState<GameState>({
    score: 0,
    timer: initialTimer,
    isActive: false,
    difficulty: "easy",
  });
  const { toast } = useToast();

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isActive && state.timer > 0) {
      interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timer: prev.timer - 1,
        }));
      }, 1000);
    } else if (state.timer === 0 && state.isActive) {
      handleGameOver();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.isActive, state.timer]);

  const startGame = () => {
    setState((prev) => ({
      ...prev,
      isActive: true,
    }));
  };

  const pauseGame = () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  const resetGame = () => {
    setState((prev) => ({
      ...prev,
      score: 0,
      timer: initialTimer,
      isActive: false,
    }));
  };

  const updateScore = (points: number) => {
    setState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const setDifficulty = (difficulty: Difficulty) => {
    setState((prev) => ({
      ...prev,
      difficulty,
    }));
  };

  const handleGameOver = async () => {
    setState((prev) => ({
      ...prev,
      isActive: false,
    }));

    try {
      // Map our custom game types to database types if needed
      let dbGameType: DatabaseGameType;
      
      // Handle our custom game types that don't directly map to database enum
      if (gameType === "twenty_four") {
        // We can use word_scramble as a fallback since "twenty_four" isn't in game_type enum
        dbGameType = "word_scramble";
      } else if (gameType === "rope_untangle") {
        // Use word_search as fallback for rope_untangle since memory_game isn't a valid DatabaseGameType
        dbGameType = "word_search";
      } else {
        // For standard game types that exist in the database enum
        dbGameType = gameType as DatabaseGameType;
      }
      
      const { error } = await supabase.from("game_sessions").insert({
        game_type: dbGameType,
        score: state.score,
        duration_seconds: initialTimer - state.timer,
      });

      if (error) throw error;

      toast({
        title: "Game Over!",
        description: `Your final score is ${state.score}`,
      });

      if (onGameOver) {
        onGameOver();
      }
    } catch (error) {
      console.error("Error saving game session:", error);
      toast({
        title: "Error",
        description: "Failed to save game session",
        variant: "destructive",
      });
    }
  };

  return {
    ...state,
    startGame,
    pauseGame,
    resetGame,
    updateScore,
    setDifficulty,
  };
};
