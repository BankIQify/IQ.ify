
import { Trophy, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWordSearchContext } from "../context/WordSearchContext";

export const GameCompletedModal = () => {
  const { totalWordsCount, score, timeTaken, handleNewPuzzle } = useWordSearchContext();

  return (
    <div className="animate-fadeIn fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-pastel-yellow animate-float">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-amber-300 to-yellow-500 p-5 rounded-full">
              <Trophy className="h-16 w-16 text-white animate-pulse" />
            </div>
          </div>
          
          <h3 className="text-3xl font-bold mb-2 text-iqify-navy">Congratulations!</h3>
          <p className="text-xl text-gray-600 mb-6">
            <span className="font-bold">Amazing job!</span> You found all {totalWordsCount} words!
          </p>
          
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="bg-pastel-blue/20 p-4 rounded-xl border-2 border-pastel-blue/30">
              <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-sm text-gray-500">Time Taken</p>
              <p className="text-2xl font-bold text-iqify-navy">{timeTaken}s</p>
            </div>
            <div className="bg-pastel-purple/20 p-4 rounded-xl border-2 border-pastel-purple/30">
              <Award className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-iqify-navy">{score}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleNewPuzzle} 
            className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90 p-6 h-auto text-lg font-bold rounded-xl shadow-md"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};
