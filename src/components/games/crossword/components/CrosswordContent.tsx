
import { useIsMobile } from "@/hooks/use-mobile";
import { CrosswordGrid } from "./CrosswordGrid";
import { CluesList } from "./CluesList";
import type { CrosswordCell, CrosswordClue } from "../utils/types";

interface CrosswordContentProps {
  grid: CrosswordCell[][];
  clues: CrosswordClue[];
  selectedCell: [number, number] | null;
  handleCellClick: (row: number, col: number) => void;
  handleKeyPress: (event: React.KeyboardEvent, row: number, col: number) => void;
}

export const CrosswordContent = ({
  grid,
  clues,
  selectedCell,
  handleCellClick,
  handleKeyPress
}: CrosswordContentProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col space-y-6">
      {/* For mobile: crossword grid on top, clues below */}
      {isMobile ? (
        <>
          <div className="w-full overflow-auto">
            <CrosswordGrid 
              grid={grid}
              selectedCell={selectedCell}
              handleCellClick={handleCellClick}
              handleKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="w-full">
            <CluesList 
              clues={clues}
            />
          </div>
        </>
      ) : (
        // For desktop: grid on left (2/3), clues on right (1/3)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CrosswordGrid 
              grid={grid}
              selectedCell={selectedCell}
              handleCellClick={handleCellClick}
              handleKeyPress={handleKeyPress}
            />
          </div>
          
          <div className="lg:col-span-1">
            <CluesList 
              clues={clues}
            />
          </div>
        </div>
      )}
    </div>
  );
};
