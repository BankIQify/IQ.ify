
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Difficulty } from "@/components/games/GameSettings";

interface CrosswordCell {
  letter: string;
  number?: number;
  isBlack: boolean;
  userInput: string;
}

interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
}

export const CrosswordGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [clues, setClues] = useState<CrosswordClue[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isAcross, setIsAcross] = useState(true);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    // Example 5x5 crossword
    const exampleGrid: CrosswordCell[][] = Array(5).fill(null).map(() =>
      Array(5).fill(null).map(() => ({
        letter: '',
        isBlack: false,
        userInput: ''
      }))
    );

    // Add some black cells and numbers
    exampleGrid[0][2].isBlack = true;
    exampleGrid[2][2].isBlack = true;
    exampleGrid[4][2].isBlack = true;

    // Add numbers to cells
    exampleGrid[0][0].number = 1;
    exampleGrid[0][3].number = 2;
    exampleGrid[1][0].number = 3;
    exampleGrid[3][0].number = 4;

    const exampleClues: CrosswordClue[] = [
      { number: 1, clue: "Feline friend", answer: "CAT", direction: "across" },
      { number: 2, clue: "Color of the sky", answer: "BLUE", direction: "across" },
      { number: 1, clue: "Writing tool", answer: "PEN", direction: "down" },
      { number: 3, clue: "Ocean", answer: "SEA", direction: "down" }
    ];

    setGrid(exampleGrid);
    setClues(exampleClues);
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
    newGrid[row][col] = { ...newGrid[row][col], userInput: value };
    setGrid(newGrid);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-0.5 bg-gray-200 p-0.5 max-w-[500px] mx-auto">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square relative ${
                cell.isBlack ? 'bg-black' : 'bg-white'
              } ${
                selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                  ? 'bg-blue-100'
                  : ''
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell.number && (
                <span className="absolute top-0 left-0 text-xs pl-0.5">
                  {cell.number}
                </span>
              )}
              {!cell.isBlack && (
                <input
                  type="text"
                  maxLength={1}
                  value={cell.userInput}
                  className="w-full h-full text-center text-lg font-medium bg-transparent focus:outline-none"
                  onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                  readOnly
                />
              )}
            </div>
          ))
        ))}
      </div>

      <div className="space-y-4 max-w-[500px] mx-auto">
        <div>
          <h3 className="font-semibold mb-2">Across</h3>
          <div className="space-y-2">
            {clues
              .filter((clue) => clue.direction === 'across')
              .map((clue) => (
                <div key={`across-${clue.number}`}>
                  {clue.number}. {clue.clue}
                </div>
              ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Down</h3>
          <div className="space-y-2">
            {clues
              .filter((clue) => clue.direction === 'down')
              .map((clue) => (
                <div key={`down-${clue.number}`}>
                  {clue.number}. {clue.clue}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
