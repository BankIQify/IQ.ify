
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GameHeaderProps {
  themes: { id: string; name: string }[];
  selectedTheme: string;
  handleSelectTheme: (themeId: string) => void;
  handleNewPuzzle: () => void;
  handleHint: () => void;
  isHintDisabled: boolean;
  puzzleCount: number;
  themeName?: string;
  correctAnswers: number;
  totalAnswers: number;
}

export const GameHeader = ({
  themes,
  selectedTheme,
  handleSelectTheme,
  handleNewPuzzle,
  handleHint,
  isHintDisabled,
  puzzleCount,
  themeName,
  correctAnswers,
  totalAnswers
}: GameHeaderProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
      <div className="flex gap-4 items-center">
        <div className="w-48">
          <Select value={selectedTheme} onValueChange={handleSelectTheme}>
            <SelectTrigger>
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
          disabled={puzzleCount <= 1}
        >
          New Puzzle
        </Button>
        
        <Button 
          onClick={handleHint} 
          variant="outline"
          disabled={isHintDisabled}
        >
          Get Hint
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="font-medium">
          {themeName && (
            <span>Theme: <span className="text-primary">{themeName}</span></span>
          )}
        </div>
        
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {correctAnswers}/{totalAnswers} Filled
        </div>
      </div>
    </div>
  );
};
