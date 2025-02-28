
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameCompletedModalProps {
  score: number;
  solvedCount: number;
  totalPuzzles: number;
  onRestart: () => void;
}

export const GameCompletedModal = ({
  score,
  solvedCount,
  totalPuzzles,
  onRestart,
}: GameCompletedModalProps) => {
  const getPerformanceMessage = () => {
    const percentage = (solvedCount / totalPuzzles) * 100;
    
    if (percentage >= 90) return "Excellent work! You're a math genius!";
    if (percentage >= 70) return "Great job! Your math skills are impressive!";
    if (percentage >= 50) return "Good effort! You're getting the hang of it!";
    if (percentage >= 30) return "Nice try! Keep practicing to improve!";
    return "Practice makes perfect! Don't give up!";
  };

  return (
    <Dialog open={true} onOpenChange={() => onRestart()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Completed!</DialogTitle>
          <DialogDescription>
            Here's how you did in the 24 Game challenge.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Final Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Puzzles Solved</p>
              <p className="text-3xl font-bold">
                {solvedCount}/{totalPuzzles}
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
