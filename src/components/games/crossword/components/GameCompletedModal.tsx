
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy } from "lucide-react";

interface GameCompletedModalProps {
  isOpen: boolean;
  score: number;
  timeTaken: number;
  handleNewPuzzle: () => void;
}

export const GameCompletedModal = ({
  isOpen,
  score,
  timeTaken,
  handleNewPuzzle,
}: GameCompletedModalProps) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-gradient-to-br from-white to-pastel-gray/20">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-100 rounded-full">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Puzzle Completed!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-4 mt-4">
            <p className="text-lg">
              Congratulations! You've successfully completed the crossword puzzle.
            </p>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-pastel-blue/20 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
              <div className="bg-pastel-purple/20 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold">{timeFormatted}</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleNewPuzzle}
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:opacity-90"
          >
            Try Another Puzzle
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
