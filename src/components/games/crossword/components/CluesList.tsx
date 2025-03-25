
import { Card, CardContent } from "@/components/ui/card";
import type { CrosswordClue } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";

interface CluesListProps {
  clues: CrosswordClue[];
}

export const CluesList = ({ clues }: CluesListProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card>
      <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Across</h3>
            <div className={`space-y-2 ${isMobile ? 'text-sm' : ''}`}>
              {clues
                .filter((clue) => clue.direction === 'across')
                .map((clue) => (
                  <div key={`across-${clue.number}`}>
                    <span className="font-medium">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Down</h3>
            <div className={`space-y-2 ${isMobile ? 'text-sm' : ''}`}>
              {clues
                .filter((clue) => clue.direction === 'down')
                .map((clue) => (
                  <div key={`down-${clue.number}`}>
                    <span className="font-medium">{clue.number}.</span> {clue.clue}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
