
import { CrosswordGrid } from "./CrosswordGrid";
import { CluesList } from "./CluesList";
import type { CrosswordCell, CrosswordClue } from "../types";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CrosswordGrid 
        grid={grid}
        selectedCell={selectedCell}
        handleCellClick={handleCellClick}
        handleKeyPress={handleKeyPress}
      />
      
      <CluesList 
        clues={clues}
      />
    </div>
  );
};
