
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Difficulty } from "@/components/games/GameSettings";

interface SudokuCell {
  value: number | null;
  isFixed: boolean;
}

export const SudokuGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [board, setBoard] = useState<SudokuCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const initializeBoard = () => {
    // Initialize empty 9x9 board
    const emptyBoard: SudokuCell[][] = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({ value: null, isFixed: false }))
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
          emptyBoard[i][j] = { value: num, isFixed: true };
        }
      });
    });

    setBoard(emptyBoard);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!board[row][col].isFixed) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!board[row][col].isFixed) {
        const newBoard = [...board];
        newBoard[row][col] = { value: number, isFixed: false };
        setBoard(newBoard);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-9 gap-0.5 bg-gray-200 p-0.5 max-w-[500px] mx-auto">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square bg-white flex items-center justify-center text-lg font-medium cursor-pointer
                ${cell.isFixed ? 'text-black font-bold' : 'text-blue-600'}
                ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'bg-blue-100' : ''}
                ${rowIndex % 3 === 2 && rowIndex < 8 ? 'border-b-2 border-gray-400' : ''}
                ${colIndex % 3 === 2 && colIndex < 8 ? 'border-r-2 border-gray-400' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.value || ''}
            </div>
          ))
        ))}
      </div>

      <div className="flex justify-center gap-2 flex-wrap max-w-[500px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            variant="outline"
            className="w-12 h-12 text-lg"
            onClick={() => handleNumberInput(number)}
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
};
