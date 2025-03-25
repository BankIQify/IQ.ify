
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { useThemeSelector } from "./useThemeSelector";
import { usePuzzleLoader } from "./usePuzzleLoader";
import { useGameInteraction } from "./useGameInteraction";

export const useWordSearchGame = (difficulty: Difficulty) => {
  // Initialize game state with timer
  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  // Theme selection
  const { themes, selectedTheme, loading: themesLoading, handleSelectTheme } = useThemeSelector();

  // Puzzle loading and management
  const { 
    grid, 
    words, 
    gridDimensions, 
    loading: puzzleLoading, 
    handleNewPuzzle,
    setWords
  } = usePuzzleLoader(selectedTheme, difficulty);

  // Game interaction
  const { 
    selectedCells, 
    isGameComplete, 
    handleCellClick, 
    checkSelection 
  } = useGameInteraction(grid, words, setWords, gameState);

  // Combined loading state
  const loading = themesLoading || puzzleLoading;

  return {
    // Grid and words
    grid,
    words,
    selectedCells,
    gridDimensions,
    
    // Game state
    isGameComplete,
    loading,
    
    // Theme management
    themes,
    selectedTheme,
    
    // Game stats
    wordsFoundCount: words.filter(w => w.found).length,
    totalWordsCount: words.length,
    timeTaken: 300 - gameState.timer,
    
    // Game state from useGameState
    gameState,
    
    // Actions
    handleCellClick,
    checkSelection,
    handleSelectTheme,
    handleNewPuzzle,
  };
};
