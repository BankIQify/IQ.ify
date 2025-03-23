
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import type { WordToFind, WordSearchPuzzle, GridDimensions } from "../types";

// Import utilities
import { fetchThemes, fetchPuzzlesByTheme } from "../utils/puzzleDataFetcher";
import { generateDynamicPuzzle } from "../utils/puzzleGenerator";

export const useWordSearchGame = (difficulty: Difficulty) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<WordToFind[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [puzzles, setPuzzles] = useState<WordSearchPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<WordSearchPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gridDimensions, setGridDimensions] = useState<GridDimensions>({ rows: 8, cols: 8 });
  
  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  useEffect(() => {
    const initializeThemes = async () => {
      const themesData = await fetchThemes();
      setThemes(themesData);
      
      if (themesData.length > 0) {
        setSelectedTheme(themesData[0].id);
      }
      setLoading(false);
    };

    initializeThemes();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      fetchPuzzlesByTheme(selectedTheme, difficulty).then(puzzlesData => {
        setPuzzles(puzzlesData);
        setCurrentPuzzle(null);
      });
    }
  }, [selectedTheme, difficulty]);

  useEffect(() => {
    if (puzzles.length > 0 && !currentPuzzle) {
      // Select a random puzzle from available ones
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      setCurrentPuzzle(puzzles[randomIndex]);
    }
  }, [puzzles, currentPuzzle]);

  useEffect(() => {
    if (currentPuzzle) {
      initializeGameFromPuzzle(currentPuzzle);
    } else {
      // Fallback to dynamically generated puzzle based on difficulty
      generateDynamicPuzzleForGame(difficulty);
    }
  }, [currentPuzzle, difficulty]);

  useEffect(() => {
    // Check if game is complete
    if (words.length > 0 && words.every(w => w.found)) {
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  }, [words]);

  const initializeGameFromPuzzle = (puzzle: WordSearchPuzzle) => {
    const puzzleGrid = puzzle.puzzle_data.grid;
    const puzzleWords = puzzle.puzzle_data.words.map(word => ({
      word,
      found: false
    }));

    setGrid(puzzleGrid);
    setWords(puzzleWords);
    setSelectedCells([]);
    setIsGameComplete(false);
    
    // Set grid dimensions based on the puzzle grid
    setGridDimensions({
      rows: puzzleGrid.length,
      cols: puzzleGrid[0].length
    });
    
    gameState.startGame();
  };

  const generateDynamicPuzzleForGame = (difficulty: Difficulty) => {
    const { grid: dynamicGrid, words: dynamicWords, gridDimensions: dimensions } = generateDynamicPuzzle(difficulty);
    
    setGrid(dynamicGrid);
    setWords(dynamicWords);
    setSelectedCells([]);
    setIsGameComplete(false);
    setGridDimensions(dimensions);
    
    gameState.startGame();
  };

  const handleCellClick = (row: number, col: number) => {
    // Skip blank cells
    if (grid[row][col] === ' ') return;
    
    if (!gameState.isActive) {
      gameState.startGame();
    }
    
    setSelectedCells((prev) => {
      if (prev.some(([r, c]) => r === row && c === col)) {
        return prev.filter(([r, c]) => !(r === row && c === col));
      }
      return [...prev, [row, col]];
    });
  };

  const checkSelection = () => {
    if (selectedCells.length < 2) return;

    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');

    const foundWord = words.find(
      ({ word, found }) => !found && (word === selectedWord || word === selectedWord.split('').reverse().join(''))
    );

    if (foundWord) {
      setWords(words.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      ));
      
      gameState.updateScore(foundWord.word.length * 5);
      
      toast({
        title: "Word Found!",
        description: `You found "${foundWord.word}"!`,
        variant: "default",
      });
    }

    setSelectedCells([]);
    
    // Check if all words are found
    const remainingWords = words.filter(w => !w.found).length - (foundWord ? 1 : 0);
    if (remainingWords === 0) {
      toast({
        title: "Congratulations!",
        description: "You found all the words!",
        variant: "default",
      });
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
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
    
    gameState.resetGame();
  };

  return {
    // State
    grid,
    words,
    selectedCells,
    themes,
    selectedTheme,
    loading,
    isGameComplete,
    gridDimensions,
    gameState,
    
    // Derived state
    wordsFoundCount: words.filter(w => w.found).length,
    totalWordsCount: words.length,
    timeTaken: 300 - gameState.timer,
    
    // Actions
    handleCellClick,
    checkSelection,
    handleSelectTheme,
    handleNewPuzzle,
  };
};
