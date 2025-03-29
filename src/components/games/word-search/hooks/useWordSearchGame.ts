import { useState, useEffect } from 'react';
import { usePuzzleLoader } from './usePuzzleLoader';
import type { Difficulty } from '@/components/games/GameSettings';
import type { WordToFind } from '../types';

export const useWordSearchGame = (initialDifficulty: Difficulty) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('animals');
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const {
    grid,
    words,
    handleNewPuzzle: loaderHandleNewPuzzle,
    setWords,
  } = usePuzzleLoader(selectedTheme, difficulty);

  // Start timer when game starts
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCells(prev => {
      const isSelected = prev.some(([r, c]) => r === row && c === col);
      if (isSelected) {
        return prev.filter(([r, c]) => !(r === row && c === col));
      }
      return [...prev, [row, col]];
    });
  };

  const updateSelection = (row: number, col: number) => {
    setSelectedCells(prev => {
      const isSelected = prev.some(([r, c]) => r === row && c === col);
      if (!isSelected) {
        return [...prev, [row, col]];
      }
      return prev;
    });
  };

  const handleNewPuzzle = (newDifficulty?: Difficulty) => {
    setSelectedCells([]);
    setScore(0);
    setTimeElapsed(0);
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    loaderHandleNewPuzzle(newDifficulty);
  };

  const foundWords = words.filter(word => word.found).length;
  const totalWords = words.length;

  return {
    grid,
    words,
    selectedCells,
    handleCellClick,
    handleNewPuzzle,
    selectedTheme,
    setSelectedTheme,
    difficulty,
    setDifficulty,
    score,
    timeElapsed,
    foundWords,
    totalWords,
    updateSelection,
  };
};
