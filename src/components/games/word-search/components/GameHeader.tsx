
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface GameHeaderProps {
  themes: { id: string; name: string }[];
  selectedTheme: string;
  handleSelectTheme: (themeId: string) => void;
  handleNewPuzzle: () => void;
  isGameActive: boolean;
  timer: number;
  wordsFoundCount: number;
  totalWordsCount: number;
  score: number;
}

export const GameHeader = ({
  themes,
  selectedTheme,
  handleSelectTheme,
  handleNewPuzzle,
  isGameActive,
  timer,
  wordsFoundCount,
  totalWordsCount,
  score
}: GameHeaderProps) => {
  const wordsFoundPercentage = (wordsFoundCount / totalWordsCount) * 100 || 0;

  return (
    <div className="bg-gradient-to-r from-pastel-blue/20 to-pastel-green/20 rounded-xl p-4 shadow-sm">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-48">
            <Select value={selectedTheme} onValueChange={handleSelectTheme}>
              <SelectTrigger className="border-none bg-white/50 shadow-sm">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map(theme => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleNewPuzzle} 
            variant="outline"
            className="bg-white shadow-sm border-none hover:bg-white/90"
          >
            New Puzzle
          </Button>
        </div>
        
        {isGameActive && (
          <div className="flex gap-2 items-center">
            <Clock className="h-4 w-4 text-primary" />
            <span>{timer}s</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Words found: {wordsFoundCount} of {totalWordsCount}</span>
          <span>Score: {score}</span>
        </div>
        <Progress value={wordsFoundPercentage} className="h-2" />
      </div>
    </div>
  );
};
