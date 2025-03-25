
import { useEffect } from "react";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { usePuzzleData } from "./usePuzzleData";
import { useCrosswordState } from "./useCrosswordState";
import { useGridInteraction } from "./useGridInteraction";

export function useGameController(difficulty: Difficulty) {
  const { 
    startGame, 
    pauseGame, 
    isActive, 
    timer, 
    score, 
    resetGame, 
    updateScore 
  } = useGameState({
    gameType: 'crossword',
    initialTimer: 600, // 10 minutes
  });

  const {
    loading,
    themes,
    selectedTheme,
    puzzles,
    currentPuzzle,
    handleSelectTheme,
    handleNewPuzzle: newPuzzle,
  } = usePuzzleData(difficulty);

  const {
    grid,
    setGrid,
    clues,
    setClues,
    correctAnswers,
    setCorrectAnswers,
    totalAnswers,
    setTotalAnswers,
    isGameComplete,
    setIsGameComplete,
    initializeGameFromPuzzle,
  } = useCrosswordState();

  const {
    selectedCell,
    isAcross,
    handleCellClick,
    handleKeyPress,
    handleHint,
  } = useGridInteraction({
    grid,
    updateScore, 
    setGrid, 
    setCorrectAnswers, 
    pauseGame,
    setIsGameComplete,
  });

  // Initialize game when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      initializeGameFromPuzzle(currentPuzzle.puzzle_data);
      
      if (!isActive) {
        startGame();
      }
    }
  }, [currentPuzzle]);

  // Wrapper for handleNewPuzzle to include resetGame
  const handleNewPuzzle = () => {
    newPuzzle(resetGame);
  };

  return {
    loading,
    grid,
    clues,
    selectedCell,
    isAcross,
    themes,
    selectedTheme,
    puzzles,
    currentPuzzle,
    correctAnswers,
    totalAnswers,
    isGameComplete,
    score,
    timer,
    handleCellClick,
    handleKeyPress,
    handleSelectTheme,
    handleNewPuzzle,
    handleHint,
  };
}
