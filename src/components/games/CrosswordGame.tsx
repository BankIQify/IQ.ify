import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";

// Import types
import type { CrosswordCell, CrosswordClue, CrosswordPuzzle } from "./crossword/types";

// Import utilities
import { fetchThemes, fetchPuzzlesByTheme } from "./crossword/utils/puzzleDataFetcher";
import { generateDummyCrossword } from "./crossword/utils/puzzleGenerator";

// Import components
import { CrosswordGrid } from "./crossword/components/CrosswordGrid";
import { CluesList } from "./crossword/components/CluesList";
import { GameHeader } from "./crossword/components/GameHeader";
import { GameCompletedModal } from "./crossword/components/GameCompletedModal";

export const CrosswordGame = ({ difficulty }: { difficulty: Difficulty }) => {
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
        // Use the first real theme instead of hardcoded "general"
        setSelectedTheme(themesData[0].id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      // First try to fetch from database
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
    } else if (puzzles.length === 0 && !currentPuzzle && selectedTheme) {
      // If no puzzles available, fallback to generating one
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
    
    // Start the game timer when puzzle is loaded
    if (!isActive) {
      startGame();
    }
  };

  const initializeDummyGame = () => {
    // Convert theme name to a valid key for wordLists in puzzleGenerator
    // This ensures themed words are used when generating puzzles
    let themeKey = "general";
    
    // Find the theme name from the selected theme ID
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    if (selectedThemeObj) {
      const themeName = selectedThemeObj.name.toLowerCase();
      
      // Map theme names to keys in our wordLists object
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
    
    const dummyPuzzleData = generateDummyCrossword(difficulty, themeKey);
    
    setGrid(dummyPuzzleData.grid);
    setClues(dummyPuzzleData.clues);
    setSelectedCell(null);
    setCorrectAnswers(0);
    setTotalAnswers(dummyPuzzleData.clues.length);
    setIsGameComplete(false);
    
    // Start the game timer
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
    
    // Check if the cell is now correct and it was previously incorrect or empty
    const isCorrect = value !== '' && value === newGrid[row][col].letter;
    const wasPreviouslyCorrect = prevValue !== '' && prevValue === newGrid[row][col].letter;
    
    if (isCorrect && !wasPreviouslyCorrect) {
      // Increment score
      updateScore(1);
      setCorrectAnswers(prev => prev + 1);
      
      // Check if this completes a word
      checkWordCompletion(row, col);
    } else if (!isCorrect && wasPreviouslyCorrect) {
      // Decrement score if cell was correct and now is incorrect
      updateScore(-1);
      setCorrectAnswers(prev => prev - 1);
    }
    
    // Check if puzzle is complete
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
    // Check if all cells are filled correctly
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
      // Pause the game and show completion message
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
    
    // Select a different puzzle
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

  if (loading) {
    return <div className="text-center py-8">Loading puzzles...</div>;
  }

  return (
    <div className="space-y-6">
      <GameHeader 
        themes={themes}
        selectedTheme={selectedTheme}
        handleSelectTheme={handleSelectTheme}
        handleNewPuzzle={handleNewPuzzle}
        handleHint={handleHint}
        isHintDisabled={!selectedCell}
        puzzleCount={puzzles.length}
        themeName={currentPuzzle?.theme?.name}
        correctAnswers={correctAnswers}
        totalAnswers={totalAnswers}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CrosswordGrid 
          grid={grid}
          selectedCell={selectedCell}
          handleCellClick={handleCellClick}
          handleKeyPress={handleKeyPress}
        />
        
        <CluesList 
          clues={clues}
        />
      </div>
      
      <GameCompletedModal 
        isOpen={isGameComplete}
        score={score}
        timeTaken={600 - timer}
        handleNewPuzzle={handleNewPuzzle}
      />
    </div>
  );
};
