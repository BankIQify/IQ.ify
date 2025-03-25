
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trophy, Star, Clock } from "lucide-react";

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
      <AlertDialogContent className="bg-gradient-to-br from-white to-pastel-gray/20 border-4 border-pastel-yellow rounded-2xl max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-5 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-full">
              <Trophy className="h-14 w-14 text-white animate-pulse" />
            </div>
          </div>
          <AlertDialogTitle className="text-3xl font-bold text-center text-iqify-navy">
            Puzzle Completed!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-5 mt-4">
            <p className="text-xl">
              <span className="font-bold">Amazing work!</span> You've solved the crossword puzzle!
            </p>
            <div className="grid grid-cols-2 gap-5 py-4">
              <div className="bg-pastel-blue/20 p-4 rounded-xl border-2 border-pastel-blue/30">
                <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold text-iqify-navy">{score}</p>
              </div>
              <div className="bg-pastel-purple/20 p-4 rounded-xl border-2 border-pastel-purple/30">
                <Clock className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-2xl font-bold text-iqify-navy">{timeFormatted}</p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={handleNewPuzzle}
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:opacity-90 p-6 h-auto text-lg font-bold rounded-xl shadow-md"
          >
            Try Another Puzzle
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
