import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import type { CrosswordCell, CrosswordClue, CrosswordPuzzle } from "../types";
import { fetchThemes, fetchPuzzlesByTheme } from "../utils/puzzleDataFetcher";
import { generateDummyCrossword } from "../utils/puzzleGenerator";
import type { Difficulty } from "@/components/games/GameSettings";

export function useGameController(difficulty: Difficulty) {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isAcross, setIsAcross] = useState(true);
  const [themes, setThemes] = useState<{ id: string; name: string }[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [puzzles, setPuzzles] = useState<CrosswordPuzzle[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  
  const { updateScore, startGame, pauseGame, isActive, timer, score, resetGame } = useGameState({
    gameType: 'crossword',
    initialTimer: 600, // 10 minutes
  });

  useEffect(() => {
    fetchThemes().then(themesData => {
      setThemes(themesData);
      
      if (themesData.length > 0) {
        setSelectedTheme(themesData[0].id);
      }
      setLoading(false);
    });
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
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      setCurrentPuzzle(puzzles[randomIndex]);
    } else if (puzzles.length === 0 && !currentPuzzle && selectedTheme) {
      initializeDummyGame();
    }
  }, [puzzles, currentPuzzle, selectedTheme]);

  useEffect(() => {
    if (currentPuzzle) {
      initializeGameFromPuzzle(currentPuzzle);
    }
  }, [currentPuzzle]);

  const initializeGameFromPuzzle = (puzzle: CrosswordPuzzle) => {
    setGrid(puzzle.puzzle_data.grid);
    setClues(puzzle.puzzle_data.clues);
    setSelectedCell(null);
    setCorrectAnswers(0);
    setTotalAnswers(puzzle.puzzle_data.clues.length);
    setIsGameComplete(false);
    
    if (!isActive) {
      startGame();
    }
  };

  const initializeDummyGame = () => {
    let themeKey = "general";
    
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    if (selectedThemeObj) {
      const themeName = selectedThemeObj.name.toLowerCase();
      
      if (themeName.includes("animal")) themeKey = "animals";
      else if (themeName.includes("food")) themeKey = "food";
      else if (themeName.includes("science")) themeKey = "science";
      else if (themeName.includes("nature")) themeKey = "geography";
      else if (themeName.includes("countr")) themeKey = "geography";
      else if (themeName.includes("technolog")) themeKey = "science";
      else if (themeName.includes("music")) themeKey = "general";
      else if (themeName.includes("movie")) themeKey = "general";
      else if (themeName.includes("history")) themeKey = "general";
      
      console.log(`Using word list for theme: ${themeKey} (original theme: ${themeName})`);
    }
    
    // Generate a new puzzle with proper crossword layout
    const dummyPuzzleData = generateDummyCrossword(difficulty, themeKey);
    
    setGrid(dummyPuzzleData.grid);
    setClues(dummyPuzzleData.clues);
    setSelectedCell(null);
    setCorrectAnswers(0);
    setTotalAnswers(dummyPuzzleData.clues.length);
    setIsGameComplete(false);
    
    if (!isActive) {
      startGame();
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isBlack) return;

    if (selectedCell?.[0] === row && selectedCell?.[1] === col) {
      setIsAcross(!isAcross);
    } else {
      setSelectedCell([row, col]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, row: number, col: number) => {
    if (event.key === 'Backspace') {
      updateCell(row, col, '');
      moveToNextCell(row, col, true);
    } else if (event.key.length === 1 && event.key.match(/[a-zA-Z]/)) {
      updateCell(row, col, event.key.toUpperCase());
      moveToNextCell(row, col);
    }
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    const prevValue = newGrid[row][col].userInput;
    newGrid[row][col] = { ...newGrid[row][col], userInput: value };
    setGrid(newGrid);
    
    const isCorrect = value !== '' && value === newGrid[row][col].letter;
    const wasPreviouslyCorrect = prevValue !== '' && prevValue === newGrid[row][col].letter;
    
    if (isCorrect && !wasPreviouslyCorrect) {
      updateScore(1);
      setCorrectAnswers(prev => prev + 1);
      checkWordCompletion(row, col);
    } else if (!isCorrect && wasPreviouslyCorrect) {
      updateScore(-1);
      setCorrectAnswers(prev => prev - 1);
    }
    
    checkPuzzleCompletion();
  };

  const checkWordCompletion = (row: number, col: number) => {
    // This would be a more complex function to check if an entire word is now complete
    // For simplicity, we're just checking cell by cell
  };

  const moveToNextCell = (row: number, col: number, isBackspace = false) => {
    if (isAcross) {
      const nextCol = isBackspace ? col - 1 : col + 1;
      if (nextCol >= 0 && nextCol < grid[0].length && !grid[row][nextCol].isBlack) {
        setSelectedCell([row, nextCol]);
      }
    } else {
      const nextRow = isBackspace ? row - 1 : row + 1;
      if (nextRow >= 0 && nextRow < grid.length && !grid[nextRow][col].isBlack) {
        setSelectedCell([nextRow, col]);
      }
    }
  };

  const checkPuzzleCompletion = () => {
    let isComplete = true;
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (!cell.isBlack && (cell.userInput === '' || cell.userInput !== cell.letter)) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }
    
    if (isComplete) {
      pauseGame();
      setIsGameComplete(true);
      
      toast({
        title: "Congratulations!",
        description: "You've solved the crossword puzzle!",
        variant: "default",
      });
    }
  };

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleNewPuzzle = () => {
    if (puzzles.length <= 1) {
      initializeDummyGame();
      return;
    }
    
    let newPuzzle;
    do {
      const randomIndex = Math.floor(Math.random() * puzzles.length);
      newPuzzle = puzzles[randomIndex];
    } while (newPuzzle.id === currentPuzzle?.id);
    
    setCurrentPuzzle(newPuzzle);
    resetGame();
    setIsGameComplete(false);
  };

  const handleHint = () => {
    if (!selectedCell) return;
    
    const [row, col] = selectedCell;
    const cell = grid[row][col];
    
    if (cell.isBlack || cell.userInput === cell.letter) return;
    
    updateCell(row, col, cell.letter);
    
    toast({
      title: "Hint Used",
      description: `Letter "${cell.letter}" has been revealed.`,
    });
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
