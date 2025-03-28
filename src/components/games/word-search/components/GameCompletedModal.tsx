
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWordSearchContext } from "../context/WordSearchContext";

export const GameCompletedModal = () => {
  const { totalWordsCount, score, timeTaken, handleNewPuzzle } = useWordSearchContext();

  return (
    <div className="animate-scale-in fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-gray-600 mb-6">
            You found all {totalWordsCount} words and scored {score} points!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-pastel-blue/10 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Time Taken</p>
              <p className="text-xl font-medium">{timeTaken}s</p>
            </div>
            <div className="bg-pastel-purple/10 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-xl font-medium">{score}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleNewPuzzle} 
              className="flex-1 bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
            >
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
