import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWordSearchContext } from "../context/WordSearchContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const WordGrid = () => {
  const { 
    grid, 
    dimensions,
    foundWords,
    markWordAsFound,
  } = useWordSearchContext();
  
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<[number, number] | null>(null);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);

  // Calculate cells between start and current
  const getSelectedCellsInDrag = (start: [number, number], end: [number, number]) => {
    if (!start || !end) return [];
    
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    
    // Calculate direction vector
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    const length = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    
    if (length === 0) return [start];
    
    // Normalize direction
    const rowStep = rowDiff / length;
    const colStep = colDiff / length;
    
    // Generate cells
    const cells: [number, number][] = [];
    for (let i = 0; i <= length; i++) {
      const row = Math.round(startRow + rowStep * i);
      const col = Math.round(startCol + colStep * i);
      cells.push([row, col]);
    }
    
    return cells;
  };

  const handlePointerDown = (row: number, col: number) => {
    setIsDragging(true);
    setStartCell([row, col]);
    setCurrentCell([row, col]);
    setSelectedCells([[row, col]]);
  };

  const handlePointerMove = (row: number, col: number) => {
    if (!isDragging || !startCell) return;
    
    setCurrentCell([row, col]);
    
    // Get all cells in the drag path
    const cellsInDrag = getSelectedCellsInDrag(startCell, [row, col]);
    
    // Update selection with all cells in the drag path
    setSelectedCells(cellsInDrag);
  };

  const checkSelection = () => {
    if (!selectedCells.length) return;

    // Convert selected cells to word
    const word = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');
    
    // Check if word exists in any direction
    const wordReversed = word.split('').reverse().join('');
    
    if (!foundWords.includes(word) && !foundWords.includes(wordReversed)) {
      if (word.length >= 3) {
        markWordAsFound(word);
      }
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setStartCell(null);
      setCurrentCell(null);
      checkSelection();
      setSelectedCells([]);
    }
  };

  // Add pointer capture release handler
  useEffect(() => {
    const handlePointerCaptureLoss = () => {
      setIsDragging(false);
      setStartCell(null);
      setCurrentCell(null);
      checkSelection();
      setSelectedCells([]);
    };

    window.addEventListener('pointerup', handlePointerCaptureLoss);
    return () => window.removeEventListener('pointerup', handlePointerCaptureLoss);
  }, []);

  const getCellColor = (rowIndex: number, colIndex: number) => {
    const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
    const isInDragPath = startCell && currentCell && 
      getSelectedCellsInDrag(startCell, currentCell)
        .some(([r, c]) => r === rowIndex && c === colIndex);
    
    if (isSelected || isInDragPath) {
      return "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg";
    }
    
    return (rowIndex + colIndex) % 2 === 0 
      ? "bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50" 
      : "bg-slate-50 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50";
  };

  if (!dimensions || !grid.length) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardContent className={cn(
        "p-4",
        isMobile ? "max-w-full overflow-x-auto" : ""
      )}>
        <motion.div 
          ref={gridRef}
          className="grid gap-1 bg-transparent rounded-lg p-2 touch-none"
          style={{ 
            gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${dimensions.rows}, minmax(0, 1fr))`
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {grid.map((row, rowIndex) => (
            row.map((letter, colIndex) => {
              const isSelected = selectedCells.some(([r, c]) => r === rowIndex && c === colIndex);
              const isInDragPath = startCell && currentCell && 
                getSelectedCellsInDrag(startCell, currentCell)
                  .some(([r, c]) => r === rowIndex && c === colIndex);

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "aspect-square flex items-center justify-center",
                    "text-lg md:text-xl font-medium",
                    "rounded-lg cursor-pointer select-none",
                    "transition-all duration-200",
                    getCellColor(rowIndex, colIndex)
                  )}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handlePointerDown(rowIndex, colIndex);
                  }}
                  onPointerEnter={() => handlePointerMove(rowIndex, colIndex)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: (rowIndex * dimensions.cols + colIndex) * 0.02
                    }}
                    className={cn(
                      "font-semibold",
                      (isSelected || isInDragPath) ? "text-white" : "text-gray-700"
                    )}
                  >
                    {letter}
                  </motion.span>
                </motion.div>
              );
            })
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
