
import { Button } from "@/components/ui/button";
import { Link2, Move, Target, Key, Lock } from "lucide-react";

interface GameInstructionsProps {
  onStart: () => void;
}

export const GameInstructions = ({ onStart }: GameInstructionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Rope Untangle Challenge</h2>
        <p className="text-gray-600 mb-6">
          Untangle the colorful ropes by moving pins to their matching pin-holes. 
          The more difficult the level, the more complex the tangles!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-4 bg-white/80 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Colorful Ropes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Each rope has a unique color and must be untangled from the others.
            </p>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <Move className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold">Drag Pins</h3>
            </div>
            <p className="text-sm text-gray-600">
              Drag the pins to move ropes and untangle them. Each pin can only go in a matching colored hole.
            </p>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Find the Right Holes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Each pin must be placed in its matching pin-hole. The color of the pin matches its destination hole.
            </p>
          </div>
          
          <div className="p-4 bg-white/80 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-full">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold">Keys & Locks</h3>
            </div>
            <p className="text-sm text-gray-600">
              In harder levels, you'll need to find keys to unlock pins and progress through the puzzle.
            </p>
          </div>
        </div>
      </div>
      
      <Button onClick={onStart} size="lg" className="animate-pulse">
        Start Untangling!
      </Button>
    </div>
  );
};
