
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Difficulty } from "@/components/games/GameSettings";

export interface GameState {
  score: number;
  timer: number;
  isActive: boolean;
  difficulty: Difficulty;
}

interface UseGameStateProps {
  initialTimer?: number;
  gameType: 'word_search' | 'crossword' | 'sudoku' | 'times_tables';
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
      // Save game session to database
      const { error } = await supabase.from("game_sessions").insert({
        game_type: gameType,
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
