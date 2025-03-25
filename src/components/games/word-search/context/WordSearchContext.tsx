
import { createContext, useContext } from "react";
import type { WordToFind, GridDimensions } from "../types";

export interface WordSearchContextValue {
  // Grid and words
  grid: string[][];
  words: WordToFind[];
  selectedCells: [number, number][];
  gridDimensions: GridDimensions;
  
  // Game state
  isGameComplete: boolean;
  loading: boolean;
  
  // Theme management
  themes: { id: string; name: string }[];
  selectedTheme: string;
  
  // Game stats
  wordsFoundCount: number;
  totalWordsCount: number;
  timeTaken: number;
  
  // Game state from useGameState
  isGameActive: boolean;
  timer: number;
  score: number;
  
  // Actions
  handleCellClick: (row: number, col: number) => void;
  checkSelection: () => void;
  handleSelectTheme: (themeId: string) => void;
  handleNewPuzzle: () => void;
}

const WordSearchContext = createContext<WordSearchContextValue | undefined>(undefined);

export const useWordSearchContext = () => {
  const context = useContext(WordSearchContext);
  
  if (context === undefined) {
    throw new Error("useWordSearchContext must be used within a WordSearchProvider");
  }
  
  return context;
};

export default WordSearchContext;
