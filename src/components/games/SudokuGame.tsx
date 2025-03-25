
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Difficulty } from "@/components/games/GameSettings";
import { Check, RefreshCw, AlertTriangle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface SudokuCell {
  value: number | null;
  isFixed: boolean;
  isHighlighted: boolean;
  isError: boolean;
}

export const SudokuGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [animateSuccess, setAnimateSuccess] = useState(false);

  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const initializeBoard = () => {
    // Initialize empty 9x9 board
    const emptyBoard: SudokuCell[][] = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({ 
        value: null, 
        isFixed: false, 
        isHighlighted: false,
        isError: false
      }))
    );
    
    // TODO: Generate proper Sudoku puzzle based on difficulty
    // For now, adding some example numbers
    const exampleNumbers = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    exampleNumbers.forEach((row, i) => {
      row.forEach((num, j) => {
        if (num !== 0) {
          emptyBoard[i][j] = { 
            value: num, 
            isFixed: true, 
            isHighlighted: false,
            isError: false
          };
        }
      });
    });

    setBoard(emptyBoard);
    setSelectedCell(null);
    setIsComplete(false);
    setHasErrors(false);
    setAnimateSuccess(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!board[row][col].isFixed) {
      // Highlight all cells in the same row, column, and 3x3 box
      const newBoard = [...board].map((r, ri) => 
        r.map((cell, ci) => ({
          ...cell,
          isHighlighted: ri === row || ci === col || 
            (Math.floor(ri/3) === Math.floor(row/3) && Math.floor(ci/3) === Math.floor(col/3))
        }))
      );
      
      setBoard(newBoard);
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!board[row][col].isFixed) {
        const newBoard = [...board];
        const value = newBoard[row][col].value === number ? null : number;
        newBoard[row][col] = { 
          ...newBoard[row][col], 
          value,
          isError: false
        };
        
        setBoard(newBoard);
        checkCompletion(newBoard);
      }
    }
  };

  const checkCompletion = (currentBoard: SudokuCell[][]) => {
    // Simple check: are all cells filled?
    const isFilled = currentBoard.every(row => 
      row.every(cell => cell.value !== null)
    );
    
    if (isFilled && !hasErrors) {
      setIsComplete(true);
      setAnimateSuccess(true);
    }
  };

  const checkForErrors = () => {
    // This is a simplified error check that just marks duplicate numbers in rows, columns, and boxes
    const newBoard = [...board];
    let foundErrors = false;
    
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set<number>();
      for (let col = 0; col < 9; col++) {
        const value = board[row][col].value;
        if (value !== null) {
          if (seen.has(value)) {
            newBoard[row][col].isError = true;
            foundErrors = true;
          } else {
            seen.add(value);
          }
        }
      }
    }
    
    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set<number>();
      for (let row = 0; row < 9; row++) {
        const value = board[row][col].value;
        if (value !== null) {
          if (seen.has(value)) {
            newBoard[row][col].isError = true;
            foundErrors = true;
          } else {
            seen.add(value);
          }
        }
      }
    }
    
    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set<number>();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const row = boxRow * 3 + i;
            const col = boxCol * 3 + j;
            const value = board[row][col].value;
            if (value !== null) {
              if (seen.has(value)) {
                newBoard[row][col].isError = true;
                foundErrors = true;
              } else {
                seen.add(value);
              }
            }
          }
        }
      }
    }
    
    setBoard(newBoard);
    setHasErrors(foundErrors);
  };

  const getBackgroundColor = (rowIdx: number, colIdx: number, cell: SudokuCell) => {
    if (cell.isError) return "bg-red-100";
    if (selectedCell && selectedCell[0] === rowIdx && selectedCell[1] === colIdx) return "bg-pastel-yellow/70";
    if (cell.isHighlighted) return "bg-pastel-blue/20";
    
    // Alternate 3x3 boxes with different backgrounds
    const boxRow = Math.floor(rowIdx / 3);
    const boxCol = Math.floor(colIdx / 3);
    return (boxRow + boxCol) % 2 === 0 ? "bg-white" : "bg-pastel-gray/20";
  };

  return (
    <div className="space-y-6">
      {isComplete && !hasErrors && (
        <div className={cn(
          "bg-gradient-to-r from-pastel-green/50 to-pastel-blue/50 p-6 rounded-xl flex items-center gap-4 mb-6 shadow-md",
          animateSuccess ? "animate-scale-in" : ""
        )}>
          <Trophy className="h-10 w-10 text-yellow-500" />
          <div>
            <h3 className="text-xl font-bold text-green-800">Congratulations!</h3>
            <p className="text-green-700">You've completed the puzzle successfully!</p>
          </div>
        </div>
      )}
      
      {hasErrors && (
        <div className="bg-gradient-to-r from-pastel-pink/50 to-pastel-orange/50 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-md">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div>
            <p className="font-medium text-red-700">There are errors in your solution</p>
            <p className="text-sm text-red-600">Review your answers and try again</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-9 gap-0 border-2 border-primary/30 rounded-lg overflow-hidden max-w-[500px] mx-auto shadow-lg bg-white">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={cn(
                "aspect-square flex items-center justify-center text-lg font-medium cursor-pointer border border-gray-200 transition-colors",
                getBackgroundColor(rowIndex, colIndex, cell),
                cell.isFixed ? 'text-gray-900 font-bold' : 'text-blue-600',
                cell.isError ? 'text-red-600' : '',
                !cell.isFixed && 'hover:bg-pastel-yellow/50'
              )}
            >
              {cell.value || ''}
            </div>
          ))
        ))}
      </div>

      <div className="flex justify-center gap-2 flex-wrap max-w-[500px] mx-auto mt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="outline"
            className={cn(
              "w-12 h-12 text-lg font-bold transition-all",
              "hover:bg-pastel-blue/50 hover:scale-105",
              selectedCell ? "opacity-100" : "opacity-70"
            )}
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </Button>
        ))}
        
        <div className="flex gap-2 mt-4 w-full">
          <Button 
            variant="outline" 
            className="flex-1 bg-pastel-orange/30 hover:bg-pastel-orange/50 border-pastel-orange" 
            onClick={initializeBoard}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1 bg-pastel-purple/30 hover:bg-pastel-purple/50 border-pastel-purple" 
            onClick={checkForErrors}
          >
            <Check className="h-4 w-4 mr-2" />
            Check
          </Button>
        </div>
      </div>
    </div>
  );
};
