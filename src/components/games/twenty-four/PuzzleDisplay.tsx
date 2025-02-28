
import { TwentyFourPuzzle } from "../TwentyFourGame";
import { PuzzleCard } from "./PuzzleCard";

interface PuzzleDisplayProps {
  puzzle: TwentyFourPuzzle;
  currentIndex: number;
  totalPuzzles: number;
}

export const PuzzleDisplay = ({ 
  puzzle, 
  currentIndex,
  totalPuzzles
}: PuzzleDisplayProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm mb-2">
          Puzzle {currentIndex + 1} of {totalPuzzles}
        </p>
        <h2 className="text-xl font-bold">
          Make 24 using these four numbers
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Use each number exactly once and any of +, -, *, / and parentheses.
        </p>
      </div>

      <div className="flex justify-center gap-4 my-8">
        {puzzle.numbers.map((number, idx) => (
          <PuzzleCard key={idx} number={number} />
        ))}
      </div>
    </div>
  );
};
