
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWordSearchContext } from "../context/WordSearchContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const WordGrid = () => {
  const { grid, gridDimensions, selectedCells, handleCellClick } = useWordSearchContext();
  const isMobile = useIsMobile();

  // Function to determine cell color based on various conditions
  const getCellColor = (rowIndex: number, colIndex: number) => {
    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
    const isBlank = grid[rowIndex][colIndex] === ' ';
    
    if (isBlank) {
      return "bg-slate-200 cursor-default";
    }
    
    if (isSelected) {
      return "bg-pastel-purple text-white";
    }
    
    // Create a checkered pattern for non-blank cells
    return (rowIndex + colIndex) % 2 === 0 
      ? "bg-white hover:bg-pastel-purple/10 cursor-pointer" 
      : "bg-slate-50 hover:bg-pastel-purple/10 cursor-pointer";
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardContent className={`p-0 ${isMobile ? 'max-w-full overflow-x-auto' : ''}`}>
        <div 
          className={`grid gap-0 bg-white`} 
          style={{ 
            gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`
          }}
        >
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-lg font-medium border border-slate-100",
                  "transition-colors",
                  isMobile ? "min-w-8 min-h-8" : "hover:scale-105 transition-all duration-200 transform",
                  getCellColor(rowIndex, colIndex)
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onTouchStart={(e) => {
                  // Prevent scrolling when touching grid cells
                  e.preventDefault();
                  handleCellClick(rowIndex, colIndex);
                }}
              >
                {letter !== ' ' ? letter : ''}
              </div>
            ))
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
