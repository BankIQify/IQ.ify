
import React from "react";
import { useWordSearchGame } from "../hooks/useWordSearchGame";
import WordSearchContext from "./WordSearchContext";
import type { Difficulty } from "@/components/games/GameSettings";

interface WordSearchProviderProps {
  difficulty: Difficulty;
  children: React.ReactNode;
}

export const WordSearchProvider = ({ 
  difficulty,
  children 
}: WordSearchProviderProps) => {
  const gameState = useWordSearchGame(difficulty);
  
  return (
    <WordSearchContext.Provider value={{
      // Grid and words
      grid: gameState.grid,
      words: gameState.words,
      selectedCells: gameState.selectedCells,
      gridDimensions: gameState.gridDimensions,
      
      // Game state
      isGameComplete: gameState.isGameComplete,
      loading: gameState.loading,
      isDragging: gameState.isDragging,
      
      // Theme management
      themes: gameState.themes,
      selectedTheme: gameState.selectedTheme,
      
      // Game stats
      wordsFoundCount: gameState.wordsFoundCount,
      totalWordsCount: gameState.totalWordsCount,
      timeTaken: gameState.timeTaken,
      
      // Game state from useGameState
      isGameActive: gameState.gameState.isActive,
      timer: gameState.gameState.timer,
      score: gameState.gameState.score,
      
      // Actions
      handleCellClick: gameState.handleCellClick,
      handleMouseDown: gameState.handleMouseDown,
      handleMouseEnter: gameState.handleMouseEnter,
      handleMouseUp: gameState.handleMouseUp,
      checkSelection: gameState.checkSelection,
      handleSelectTheme: gameState.handleSelectTheme,
      handleNewPuzzle: gameState.handleNewPuzzle,
    }}>
      {children}
    </WordSearchContext.Provider>
  );
};
