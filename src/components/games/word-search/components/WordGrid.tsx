
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWordSearchContext } from "../context/WordSearchContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";

export const WordGrid = () => {
  const { 
    grid, 
    gridDimensions, 
    selectedCells, 
    handleCellClick,
    checkSelection 
  } = useWordSearchContext();
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Track drag state
  const [isDragging, setIsDragging] = useState(false);
  const [lastCellVisited, setLastCellVisited] = useState<[number, number] | null>(null);

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

  // Function to get cell element from coordinates
  const getCellFromPoint = (x: number, y: number): [number, number] | null => {
    if (!gridRef.current) return null;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeX = x - gridRect.left;
    const relativeY = y - gridRect.top;
    
    // Check if point is within grid
    if (relativeX < 0 || relativeY < 0 || relativeX > gridRect.width || relativeY > gridRect.height) {
      return null;
    }
    
    const cellWidth = gridRect.width / gridDimensions.cols;
    const cellHeight = gridRect.height / gridDimensions.rows;
    
    const col = Math.floor(relativeX / cellWidth);
    const row = Math.floor(relativeY / cellHeight);
    
    // Ensure we're within bounds
    if (row >= 0 && row < gridDimensions.rows && col >= 0 && col < gridDimensions.cols) {
      return [row, col];
    }
    
    return null;
  };

  // Handle mouse/touch move during drag
  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    const y = e.clientY;
    const cellCoords = getCellFromPoint(x, y);
    
    if (cellCoords && (lastCellVisited?.[0] !== cellCoords[0] || lastCellVisited?.[1] !== cellCoords[1])) {
      const [row, col] = cellCoords;
      
      // Skip blank cells
      if (grid[row][col] === ' ') return;
      
      // Add to selection
      handleCellClick(row, col);
      setLastCellVisited(cellCoords);
    }
  };

  // Handle mouse/touch up to end drag
  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setLastCellVisited(null);
      
      // Check if a word was formed
      checkSelection();
      
      // Clean up event listeners
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    }
  };

  // Start drag when pointer down on a cell
  const handlePointerDown = (rowIndex: number, colIndex: number) => {
    // Skip if cell is blank
    if (grid[rowIndex][colIndex] === ' ') return;
    
    // Clear previous selection
    // Don't clear selection, just start new drag
    setIsDragging(true);
    setLastCellVisited([rowIndex, colIndex]);
    
    // Handle the initial cell click
    handleCellClick(rowIndex, colIndex);
    
    // Add event listeners for dragging
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardContent className={`p-0 ${isMobile ? 'max-w-full overflow-x-auto' : ''}`}>
        <div 
          ref={gridRef}
          className={`grid gap-0 bg-white touch-none`} 
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
                onPointerDown={(e) => {
                  e.preventDefault(); // Prevent default behaviors
                  handlePointerDown(rowIndex, colIndex);
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
