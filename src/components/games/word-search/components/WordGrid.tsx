
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWordSearchContext } from "../context/WordSearchContext";

export const WordGrid = () => {
  const { 
    grid, 
    gridDimensions, 
    selectedCells, 
    handleCellClick,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isDragging
  } = useWordSearchContext();

  // Function to determine cell color based on various conditions
  const getCellColor = (rowIndex: number, colIndex: number) => {
    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
    const isBlank = grid[rowIndex][colIndex] === ' ';
    
    if (isBlank) {
      return "bg-slate-200 cursor-default";
    }
    
    if (isSelected) {
      return "bg-pastel-purple/80 text-white shadow-sm scale-105";
    }
    
    // Create a checkered pattern for non-blank cells
    return (rowIndex + colIndex) % 2 === 0 
      ? "bg-white hover:bg-pastel-purple/10 hover:scale-105 cursor-pointer" 
      : "bg-slate-50 hover:bg-pastel-purple/10 hover:scale-105 cursor-pointer";
  };

  return (
    <Card className="overflow-hidden border-2 border-pastel-blue rounded-xl shadow-lg">
      <CardContent className="p-0">
        <div 
          className={`grid gap-0 bg-white rounded-xl`} 
          style={{ 
            gridTemplateColumns: `repeat(${gridDimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, minmax(0, 1fr))`
          }}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleMouseUp}
        >
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-xl font-bold border border-slate-100",
                  "transition-all duration-200 transform select-none",
                  getCellColor(rowIndex, colIndex)
                )}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                onTouchMove={(e) => {
                  if (isDragging) {
                    // Get touch position and find the element at that position
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    // Find the grid cell coordinates from the element id
                    if (element && element.id) {
                      const cellCoords = element.id.split('-');
                      if (cellCoords.length === 2) {
                        handleMouseEnter(parseInt(cellCoords[0]), parseInt(cellCoords[1]));
                      }
                    }
                  }
                }}
                id={`${rowIndex}-${colIndex}`}
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
