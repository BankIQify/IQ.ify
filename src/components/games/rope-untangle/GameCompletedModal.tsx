
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award, Timer, Crown } from "lucide-react";
import type { Difficulty } from "@/components/games/GameSettings";

interface GameCompletedModalProps {
  score: number;
  solvedPercentage: number;
  onRestart: () => void;
  difficulty: Difficulty;
}

export const GameCompletedModal = ({
  score,
  solvedPercentage,
  onRestart,
  difficulty,
}: GameCompletedModalProps) => {
  const getPerformanceMessage = () => {
    if (solvedPercentage >= 100) {
      if (difficulty === "hard") return "Master Untangler! You have amazing spatial reasoning skills!";
      if (difficulty === "medium") return "Great job! You're becoming a knot-solving expert!";
      return "Well done! You've mastered the basics of untangling!";
    }
    
    if (solvedPercentage >= 70) return "Good effort! You're getting the hang of untangling the ropes!";
    if (solvedPercentage >= 40) return "Not bad, but there's room for improvement!";
    
    return "Practice makes perfect! Keep trying to untangle those ropes!";
  };

  const getDifficultyIcon = () => {
    switch(difficulty) {
      case "easy": return <Award className="h-8 w-8 text-blue-500" />;
      case "medium": return <Timer className="h-8 w-8 text-purple-500" />;
      case "hard": return <Crown className="h-8 w-8 text-orange-500" />;
      default: return <Award className="h-8 w-8 text-blue-500" />;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onRestart()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getDifficultyIcon()}
            <DialogTitle>Game Completed!</DialogTitle>
          </div>
          <DialogDescription>
            Here's how you did in the Rope Untangling challenge.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Final Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completion</p>
              <p className="text-3xl font-bold">
                {Math.floor(solvedPercentage)}%
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-medium">{getPerformanceMessage()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onRestart} className="w-full">
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
