
import { Card, CardContent } from "@/components/ui/card";
import type { CrosswordCell } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-2 overflow-x-auto' : 'p-4'}`}>
        <div 
          className="grid gap-0.5 bg-gray-200 p-0.5 mx-auto"
          style={{ 
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            maxWidth: isMobile ? '100%' : '500px'
          }}
        >
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
                } ${isMobile ? 'min-w-7 min-h-7' : ''}`}
                onClick={() => !cell.isBlack && handleCellClick(rowIndex, colIndex)}
                onTouchStart={(e) => {
                  if (!cell.isBlack) {
                    e.preventDefault();
                    handleCellClick(rowIndex, colIndex);
                  }
                }}
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
                    value={cell.userInput || ''}
                    className="w-full h-full text-center text-lg font-medium bg-transparent focus:outline-none uppercase"
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
