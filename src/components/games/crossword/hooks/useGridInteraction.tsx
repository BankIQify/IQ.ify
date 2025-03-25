
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import type { CrosswordCell } from "../utils/types";

interface UseGridInteractionProps {
  grid: CrosswordCell[][];
  updateScore: (points: number) => void;
  setGrid: React.Dispatch<React.SetStateAction<CrosswordCell[][]>>;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  pauseGame: () => void;
  setIsGameComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useGridInteraction({
  grid, 
  updateScore, 
  setGrid, 
  setCorrectAnswers, 
  pauseGame,
  setIsGameComplete
}: UseGridInteractionProps) {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isAcross, setIsAcross] = useState(true);

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
    selectedCell,
    isAcross,
    handleCellClick,
    handleKeyPress,
    handleHint,
  };
}
