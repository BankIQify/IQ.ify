
import { useState, useEffect } from "react";
import { fetchPuzzlesByTheme } from "../utils/puzzleDataFetcher";
import { generateDynamicPuzzle } from "../utils/puzzleGenerator";
import type { Difficulty } from "@/components/games/GameSettings";
import type { WordSearchPuzzle, GridDimensions, WordToFind } from "../types";

export const usePuzzleLoader = (
  selectedTheme: string,
  difficulty: Difficulty
) => {
  const [puzzles, setPuzzles] = useState<WordSearchPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<WordToFind[]>([]);
  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({ rows: 8, cols: 8 });
  const [loading, setLoading] = useState(true);

  // Fetch puzzles when theme or difficulty changes
  useEffect(() => {
    if (selectedTheme) {
      setLoading(true);
      fetchPuzzlesByTheme(selectedTheme, difficulty).then(puzzlesData => {
        setPuzzles(puzzlesData);
        setCurrentPuzzle(null);
        setLoading(false);
      });
    }
  }, [selectedTheme, difficulty]);

  // Select a random puzzle when puzzles are loaded
  useEffect(() => {
    if (puzzles.length > 0 && !currentPuzzle) {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      setCurrentPuzzle(puzzles[randomIndex]);
    }
  }, [puzzles, currentPuzzle]);

  // Initialize game when current puzzle changes
  useEffect(() => {
    if (currentPuzzle) {
      initializeGameFromPuzzle(currentPuzzle);
    } else if (selectedTheme) {
      // Fallback to dynamically generated puzzle
      generateDynamicPuzzleForGame(difficulty);
    }
  }, [currentPuzzle, difficulty, selectedTheme]);

  const initializeGameFromPuzzle = (puzzle: WordSearchPuzzle) => {
    const puzzleGrid = puzzle.puzzle_data.grid;
    const puzzleWords = puzzle.puzzle_data.words.map(word => ({
      word,
      found: false
    }));

    setGrid(puzzleGrid);
    setWords(puzzleWords);
    
    // Set grid dimensions based on the puzzle grid
    setGridDimensions({
      rows: puzzleGrid.length,
      cols: puzzleGrid[0].length
    });
  };

  const generateDynamicPuzzleForGame = (difficulty: Difficulty) => {
    const { grid: dynamicGrid, words: dynamicWords, gridDimensions: dimensions } = generateDynamicPuzzle(difficulty);
    
    setGrid(dynamicGrid);
    setWords(dynamicWords);
    setGridDimensions(dimensions);
  };

  const handleNewPuzzle = () => {
    if (puzzles.length > 1) {
      // Select a different puzzle
      let newPuzzle;
      do {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        newPuzzle = puzzles[randomIndex];
      } while (newPuzzle.id === currentPuzzle?.id);
      
      setCurrentPuzzle(newPuzzle);
    } else {
      // Generate a new dynamic puzzle
      generateDynamicPuzzleForGame(difficulty);
    }
  };

  return {
    grid,
    words,
    gridDimensions,
    loading,
    handleNewPuzzle,
    setWords
  };
};
