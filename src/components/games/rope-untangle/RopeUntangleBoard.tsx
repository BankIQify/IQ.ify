
import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Pin } from "./Pin";
import { PinHole } from "./PinHole";
import { Rope } from "./Rope";
import { Lock } from "./Lock";
import { Key } from "./Key";
import { useToast } from "@/components/ui/use-toast";
import type { Difficulty } from "@/components/games/GameSettings";

export interface GameBoard {
  width: number;
  height: number;
  backgroundPattern: string;
}

export interface RopeSegment {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  pinId: string;
  isUntangled: boolean;
}

export interface PinPosition {
  id: string;
  x: number;
  y: number;
  color: string;
  isMovable: boolean;
  matchingHoleId: string;
  isMatched: boolean;
  requiredKeyId?: string;
}

export interface PinHolePosition {
  id: string;
  x: number;
  y: number;
  color: string;
  isOccupied: boolean;
}

export interface LockPosition {
  id: string;
  x: number;
  y: number;
  isUnlocked: boolean;
  requiredKeyId: string;
  affectedPinIds: string[];
}

export interface KeyPosition {
  id: string;
  x: number;
  y: number;
  isCollected: boolean;
}

interface RopeUntangleBoardProps {
  gameBoard: GameBoard;
  ropes: RopeSegment[];
  pins: PinPosition[];
  pinHoles: PinHolePosition[];
  locks: LockPosition[];
  keys: KeyPosition[];
  onPinDrag: (pinId: string, x: number, y: number) => void;
  onPinDrop: (pinId: string, holeId: string | null) => void;
  progress: number;
  onCompleted: () => void;
  difficulty: Difficulty;
}

export const RopeUntangleBoard = ({
  gameBoard,
  ropes,
  pins,
  pinHoles,
  locks,
  keys,
  onPinDrag,
  onPinDrop,
  progress,
  onCompleted,
  difficulty,
}: RopeUntangleBoardProps) => {
  const [draggedPin, setDraggedPin] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (progress >= 100) {
      onCompleted();
    }
  }, [progress, onCompleted]);

  const handlePinMouseDown = (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId);
    
    if (!pin || !pin.isMovable) {
      if (pin && !pin.isMovable && pin.requiredKeyId) {
        toast({
          title: "Pin locked",
          description: "This pin requires a key to unlock it first.",
          variant: "destructive",
        });
      }
      return;
    }
    
    setDraggedPin(pinId);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedPin || !boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
    
    onPinDrag(draggedPin, x, y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!draggedPin || !boardRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const boardRect = boardRef.current.getBoundingClientRect();
    const x = touch.clientX - boardRect.left;
    const y = touch.clientY - boardRect.top;
    
    onPinDrag(draggedPin, x, y);
  };

  const handleMouseUp = () => {
    if (!draggedPin) return;
    
    // Find if the pin is over a hole
    const pin = pins.find((p) => p.id === draggedPin);
    if (!pin) return;
    
    const hole = pinHoles.find((h) => {
      const distance = Math.sqrt(
        Math.pow(h.x - pin.x, 2) + Math.pow(h.y - pin.y, 2)
      );
      return distance < 30 && h.color === pin.color && !h.isOccupied;
    });
    
    onPinDrop(draggedPin, hole ? hole.id : null);
    setDraggedPin(null);
  };

  // Generate different background patterns based on difficulty
  const getBackgroundPattern = () => {
    switch (difficulty) {
      case "easy":
        return "bg-pastel-blue/20";
      case "medium":
        return "bg-pastel-purple/20";
      case "hard":
        return "bg-pastel-orange/20";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Progress</h3>
        <span className="text-sm font-medium">{Math.floor(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />

      <div 
        ref={boardRef}
        className={`relative rounded-lg overflow-hidden border border-gray-200 shadow-inner ${getBackgroundPattern()}`}
        style={{ 
          width: '100%', 
          height: 500, 
          maxHeight: '70vh',
          touchAction: draggedPin ? 'none' : 'auto'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Draw ropes first so they appear below pins */}
        {ropes.map((rope) => (
          <Rope key={rope.id} rope={rope} />
        ))}
        
        {/* Draw pin holes */}
        {pinHoles.map((hole) => (
          <PinHole key={hole.id} hole={hole} />
        ))}
        
        {/* Draw locks */}
        {locks.map((lock) => (
          <Lock key={lock.id} lock={lock} />
        ))}
        
        {/* Draw keys */}
        {keys.map((key) => (
          <Key key={key.id} keyObj={key} />
        ))}
        
        {/* Draw pins on top */}
        {pins.map((pin) => (
          <Pin 
            key={pin.id} 
            pin={pin} 
            onMouseDown={() => handlePinMouseDown(pin.id)}
            isDragging={draggedPin === pin.id}
          />
        ))}
      </div>
    </div>
  );
};
