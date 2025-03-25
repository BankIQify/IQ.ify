
import { Card, CardContent } from "@/components/ui/card";
import type { CrosswordCell } from "../types";
import { cn } from "@/lib/utils";

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  selectedCell: [number, number] | null;
  handleCellClick: (row: number, col: number) => void;
  handleKeyPress: (event: React.KeyboardEvent, row: number, col: number) => void;
}

export const CrosswordGrid = ({
  grid,
  selectedCell,
  handleCellClick,
  handleKeyPress
}: CrosswordGridProps) => {
  // Calculate grid columns dynamically
  const gridCols = grid[0]?.length || 5;
  
  return (
    <Card className="rounded-xl overflow-hidden shadow-lg border-2 border-primary/30">
      <CardContent className="p-1">
        <div 
          className="grid gap-0 bg-gray-200"
          style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square relative transition-all duration-200",
                  cell.isBlack ? 'bg-black' : 'bg-white',
                  selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
                    ? 'bg-pastel-purple/30 scale-105 shadow-sm z-10' 
                    : '',
                  "border border-gray-300",
                  !cell.isBlack && "hover:bg-pastel-blue/10 cursor-pointer"
                )}
                onClick={() => !cell.isBlack && handleCellClick(rowIndex, colIndex)}
              >
                {cell.number && (
                  <span className="absolute top-0 left-0 text-xs px-1 pt-0.5 text-gray-700 font-medium">
                    {cell.number}
                  </span>
                )}
                {!cell.isBlack && (
                  <input
                    type="text"
                    maxLength={1}
                    value={cell.userInput || ''}
                    className={cn(
                      "w-full h-full text-center text-lg font-medium bg-transparent focus:outline-none uppercase",
                      cell.userInput && "text-primary font-bold animate-scale-in"
                    )}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}
                    onChange={(e) => {
                      // This allows typing directly into the input
                      const event = {
                        key: e.target.value.slice(-1),
                        preventDefault: () => {}
                      } as React.KeyboardEvent;
                      handleKeyPress(event, rowIndex, colIndex);
                    }}
                  />
                )}
              </div>
            ))
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
