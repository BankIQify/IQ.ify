import React from "react";
import type { Difficulty } from "@/components/games/GameSettings";
import { WordSearchContext } from "./WordSearchContext";
import { generateWordSearchPuzzle } from "../utils/puzzleGenerator";

interface WordSearchProviderProps {
  difficulty: Difficulty;
  children: React.ReactNode;
}

export const WordSearchProvider = ({ 
  difficulty: initialDifficulty,
  children 
}: WordSearchProviderProps) => {
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [words, setWords] = React.useState<string[]>([]);
  const [dimensions, setDimensions] = React.useState<{ rows: number; cols: number }>({ rows: 0, cols: 0 });
  const [foundWords, setFoundWords] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [difficulty, setDifficulty] = React.useState<Difficulty>(initialDifficulty);
  const [theme, setTheme] = React.useState<string>('animals');

  const handleNewPuzzle = React.useCallback((newDifficulty?: Difficulty, newTheme?: string) => {
    setLoading(true);
    const nextDifficulty = newDifficulty || difficulty;
    const nextTheme = newTheme || theme;
    
    setDifficulty(nextDifficulty);
    setTheme(nextTheme);
    
    const { grid: newGrid, words: newWords, dimensions: newDimensions } = generateWordSearchPuzzle(nextDifficulty, nextTheme);
    
    setGrid(newGrid);
    setWords(newWords);
    setDimensions(newDimensions);
    setFoundWords([]);
    setLoading(false);
  }, [difficulty, theme]);

  const markWordAsFound = React.useCallback((word: string) => {
    if (!foundWords.includes(word)) {
      setFoundWords(prev => [...prev, word]);
    }
  }, [foundWords]);

  React.useEffect(() => {
    handleNewPuzzle();
  }, [handleNewPuzzle]);

  const value = React.useMemo(() => ({
    grid,
    words,
    dimensions,
    foundWords,
    loading,
    difficulty,
    theme,
    handleNewPuzzle,
    markWordAsFound,
  }), [
    grid,
    words,
    dimensions,
    foundWords,
    loading,
    difficulty,
    theme,
    handleNewPuzzle,
    markWordAsFound,
  ]);

  return (
    <WordSearchContext.Provider value={value}>
      {children}
    </WordSearchContext.Provider>
  );
};
