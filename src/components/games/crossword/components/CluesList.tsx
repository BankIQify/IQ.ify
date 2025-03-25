
import { Card, CardContent } from "@/components/ui/card";
import type { CrosswordClue } from "../types";
import { cn } from "@/lib/utils";

interface CluesListProps {
  clues: CrosswordClue[];
  selectedClue?: CrosswordClue | null;
  onClueSelect?: (clue: CrosswordClue) => void;
}

export const CluesList = ({ 
  clues,
  selectedClue,
  onClueSelect
}: CluesListProps) => {
  const acrossClues = clues.filter(clue => clue.direction === 'across');
  const downClues = clues.filter(clue => clue.direction === 'down');

  const ClueItem = ({ clue }: { clue: CrosswordClue }) => {
    const isSelected = selectedClue?.number === clue.number && 
                       selectedClue?.direction === clue.direction;
    
    return (
      <div 
        key={`${clue.direction}-${clue.number}`}
        className={cn(
          "p-2 rounded-md transition-all duration-200 mb-2",
          isSelected ? "bg-pastel-purple/30 shadow-sm" : "hover:bg-gray-100",
          onClueSelect ? "cursor-pointer" : ""
        )}
        onClick={() => onClueSelect && onClueSelect(clue)}
      >
        <div className="flex items-start gap-2">
          <span className="font-bold text-primary min-w-[1.5rem]">{clue.number}.</span>
          <span className="text-gray-800">{clue.clue}</span>
        </div>
      </div>
    );
  };

  return (
    <Card className="rounded-xl shadow overflow-hidden border-2 border-primary/30">
      <CardContent className="p-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg text-primary mb-3 pb-2 border-b border-gray-200">Across</h3>
            <div className="space-y-1">
              {acrossClues.map(clue => (
                <ClueItem key={`across-${clue.number}`} clue={clue} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary mb-3 pb-2 border-b border-gray-200">Down</h3>
            <div className="space-y-1">
              {downClues.map(clue => (
                <ClueItem key={`down-${clue.number}`} clue={clue} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
