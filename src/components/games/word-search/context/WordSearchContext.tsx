import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateWordSearchPuzzle } from '../utils/puzzleGenerator';
import type { Difficulty } from '@/components/games/GameSettings';
import type { GridDimensions } from '../types';

interface WordSearchContextValue {
  grid: string[][];
  words: string[];
  dimensions: GridDimensions;
  foundWords: string[];
  loading: boolean;
  difficulty: Difficulty;
  theme: string;
  handleNewPuzzle: (newDifficulty?: Difficulty, newTheme?: string) => void;
  markWordAsFound: (word: string) => void;
}

export const WordSearchContext = createContext<WordSearchContextValue | undefined>(undefined);

export const WordSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<GridDimensions>({ rows: 0, cols: 0 });
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [theme, setTheme] = useState<string>('animals');

  const handleNewPuzzle = (newDifficulty?: Difficulty, newTheme?: string) => {
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
  };

  const markWordAsFound = (word: string) => {
    if (!foundWords.includes(word)) {
      setFoundWords([...foundWords, word]);
    }
  };

  useEffect(() => {
    handleNewPuzzle();
  }, []);

  const value = {
    grid,
    words,
    dimensions,
    foundWords,
    loading,
    difficulty,
    theme,
    handleNewPuzzle,
    markWordAsFound,
  };

  return (
    <WordSearchContext.Provider value={value}>
      {children}
    </WordSearchContext.Provider>
  );
};

export const useWordSearchContext = () => {
  const context = useContext(WordSearchContext);
  if (context === undefined) {
    throw new Error('useWordSearchContext must be used within a WordSearchProvider');
  }
  return context;
};
