
import { TwentyFourPuzzle } from "./types";

interface PuzzleDisplayProps {
  puzzle: TwentyFourPuzzle;
  currentIndex: number;
  totalPuzzles: number;
}

export const PuzzleDisplay = ({ puzzle, currentIndex, totalPuzzles }: PuzzleDisplayProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-500">
          Puzzle {currentIndex + 1} of {totalPuzzles}
        </span>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-center">Make 24 using these numbers</h3>
        
        <div className="flex justify-center gap-4 mb-6">
          {puzzle.numbers.map((number, index) => (
            <div 
              key={index} 
              className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-lg text-2xl font-bold shadow"
            >
              {number}
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-600 text-sm">
          Use each number exactly once with any combination of +, -, ×, ÷, and parentheses.
        </p>
      </div>
    </div>
  );
};
