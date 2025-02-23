
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Difficulty } from "@/components/games/GameSettings";

interface WordToFind {
  word: string;
  found: boolean;
}

export const WordSearchGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<WordToFind[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    // For now, using a simple example grid and words
    const exampleGrid = [
      ['C', 'A', 'T', 'D', 'O', 'G', 'H', 'I'],
      ['H', 'P', 'E', 'N', 'M', 'L', 'K', 'J'],
      ['I', 'Q', 'R', 'S', 'B', 'I', 'R', 'D'],
      ['C', 'W', 'X', 'Y', 'Z', 'A', 'B', 'C'],
      ['K', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['E', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
      ['N', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
      ['Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F']
    ];

    const exampleWords = [
      { word: 'CAT', found: false },
      { word: 'DOG', found: false },
      { word: 'BIRD', found: false },
      { word: 'CHICKEN', found: false }
    ];

    setGrid(exampleGrid);
    setWords(exampleWords);
  };

  const handleCellClick = (row: number, col: number) => {
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
    }

    setSelectedCells([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-8 gap-0.5 bg-gray-200 p-0.5 max-w-[500px] mx-auto">
        {grid.map((row, rowIndex) => (
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square bg-white flex items-center justify-center text-lg font-medium cursor-pointer
                ${selectedCells.some(([r, c]) => r === rowIndex && c === colIndex) ? 'bg-blue-100' : ''}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {letter}
            </div>
          ))
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-[500px] mx-auto">
        {words.map(({ word, found }) => (
          <div
            key={word}
            className={`px-4 py-2 rounded-full border ${
              found ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-300'
            }`}
          >
            {word}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={checkSelection} className="px-6">
          Check Selection
        </Button>
      </div>
    </div>
  );
};
