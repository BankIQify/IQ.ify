
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import type { WordToFind } from "../types";

export const useGameInteraction = (
  grid: string[][],
  words: WordToFind[],
  setWords: React.Dispatch<React.SetStateAction<WordToFind[]>>,
  gameState: ReturnType<typeof import("@/hooks/use-game-state").useGameState>
) => {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastCellRef = useRef<[number, number] | null>(null);

  // Check if game is complete
  useEffect(() => {
    if (words.length > 0 && words.every(w => w.found)) {
      setIsGameComplete(true);
      gameState.pauseGame();
    }
  }, [words, gameState]);

  const handleCellClick = (row: number, col: number) => {
    // Skip blank cells
    if (grid[row][col] === ' ') return;
    
    if (!gameState.isActive) {
      gameState.startGame();
    }
    
    // Toggle selection if cell is already selected
    if (selectedCells.some(([r, c]) => r === row && c === col)) {
      setSelectedCells(prev => prev.filter(([r, c]) => !(r === row && c === col)));
      return;
    }
    
    // Start a new selection if there are no cells selected or if dragging hasn't started
    if (selectedCells.length === 0 || !isDragging) {
      setSelectedCells([[row, col]]);
      lastCellRef.current = [row, col];
      return;
    }
    
    // Add cell to selection
    setSelectedCells(prev => [...prev, [row, col]]);
    lastCellRef.current = [row, col];
  };
  
  const handleMouseDown = (row: number, col: number) => {
    // Skip blank cells
    if (grid[row][col] === ' ') return;
    
    if (!gameState.isActive) {
      gameState.startGame();
    }
    
    setIsDragging(true);
    setSelectedCells([[row, col]]);
    lastCellRef.current = [row, col];
  };
  
  const handleMouseEnter = (row: number, col: number) => {
    // Skip if not dragging or blank cell
    if (!isDragging || grid[row][col] === ' ') return;
    
    // Get the starting cell
    const startCell = selectedCells[0];
    if (!startCell) return;
    
    // Calculate the path between startCell and current cell
    const [startRow, startCol] = startCell;
    
    // Only allow straight lines (horizontal, vertical, or diagonal)
    const rowDiff = row - startRow;
    const colDiff = col - startCol;
    
    if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
      // Direction is valid, calculate all cells along the path
      const pathCells: [number, number][] = [[startRow, startCol]];
      
      // Determine the step direction
      const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
      const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;
      
      // Calculate path
      let currentRow = startRow;
      let currentCol = startCol;
      
      while (currentRow !== row || currentCol !== col) {
        currentRow += rowStep;
        currentCol += colStep;
        pathCells.push([currentRow, currentCol]);
      }
      
      setSelectedCells(pathCells);
      lastCellRef.current = [row, col];
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Check if the selected word is valid
      if (selectedCells.length >= 2) {
        checkSelection();
      }
    }
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

  return {
    selectedCells,
    isGameComplete,
    isDragging,
    handleCellClick,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    checkSelection
  };
};
