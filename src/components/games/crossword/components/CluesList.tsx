
import { Card, CardContent } from "@/components/ui/card";
import type { CrosswordClue } from "../types";

interface CluesListProps {
  clues: CrosswordClue[];
}

export const CluesList = ({ clues }: CluesListProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Across</h3>
            <div className="space-y-2">
              {clues
                .filter((clue) => clue.direction === 'across')
                .map((clue) => (
                  <div key={`across-${clue.number}`}>
                    {clue.number}. {clue.clue}
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Down</h3>
            <div className="space-y-2">
              {clues
                .filter((clue) => clue.direction === 'down')
                .map((clue) => (
                  <div key={`down-${clue.number}`}>
                    {clue.number}. {clue.clue}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
