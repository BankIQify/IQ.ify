
import { useState, useEffect } from "react";
import type { CrosswordCell, CrosswordClue } from "../utils/types";

export function useCrosswordState() {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const initializeGameFromPuzzle = (puzzleData: { 
    grid: CrosswordCell[][]; 
    clues: CrosswordClue[];
  }) => {
    setGrid(puzzleData.grid);
    setClues(puzzleData.clues);
    setCorrectAnswers(0);
    setTotalAnswers(puzzleData.clues.length);
    setIsGameComplete(false);
  };

  return {
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
  };
}
