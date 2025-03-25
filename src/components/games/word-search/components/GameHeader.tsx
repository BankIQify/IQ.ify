
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Clock, Star, Trophy } from "lucide-react";
import { useWordSearchContext } from "../context/WordSearchContext";

export const GameHeader = () => {
  const {
    themes,
    selectedTheme,
    handleSelectTheme,
    handleNewPuzzle,
    isGameActive,
    timer,
    wordsFoundCount,
    totalWordsCount,
    score
  } = useWordSearchContext();
  
  const wordsFoundPercentage = (wordsFoundCount / totalWordsCount) * 100 || 0;

  return (
    <div className="bg-gradient-to-r from-pastel-blue/30 to-pastel-green/30 rounded-xl p-5 shadow-md border-2 border-pastel-blue/30">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-48">
            <Select value={selectedTheme} onValueChange={handleSelectTheme}>
              <SelectTrigger className="border-none bg-white/80 shadow-sm rounded-lg">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-2 border-pastel-blue/30">
                {themes.map(theme => (
                  <SelectItem key={theme.id} value={theme.id} className="focus:bg-pastel-blue/20">
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleNewPuzzle} 
            variant="outline"
            className="bg-white shadow-sm border-2 border-pastel-green/30 hover:bg-white/90 rounded-lg"
          >
            New Puzzle
          </Button>
        </div>
        
        {isGameActive && (
          <div className="flex gap-2 items-center bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-bold">{timer}s</span>
          </div>
        )}
      </div>
      
      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-base">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold">Words found: {wordsFoundCount} of {totalWordsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="font-bold">Score: {score}</span>
          </div>
        </div>
        <Progress value={wordsFoundPercentage} className="h-3 rounded-full" />
      </div>
    </div>
  );
};
