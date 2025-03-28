import { useState, useEffect } from "react";
import type { Difficulty } from "@/components/games/GameSettings";
import type { 
  GameBoard, 
  RopeSegment, 
  PinPosition, 
  PinHolePosition, 
  LockPosition, 
  KeyPosition 
} from "./RopeUntangleBoard";
import { useToast } from "@/components/ui/use-toast";

export const useRopeUntangleGame = (difficulty: Difficulty, gameState: any) => {
  const [gameBoard, setGameBoard] = useState<GameBoard>({
    width: 800,
    height: 600,
    backgroundPattern: "pattern-1"
  });
  
  const [ropes, setRopes] = useState<RopeSegment[]>([]);
  const [pins, setPins] = useState<PinPosition[]>([]);
  const [pinHoles, setPinHoles] = useState<PinHolePosition[]>([]);
  const [locks, setLocks] = useState<LockPosition[]>([]);
  const [keys, setKeys] = useState<KeyPosition[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadGameLevel(difficulty);
  }, [difficulty]);

  // Calculate progress based on matched pins
  useEffect(() => {
    if (pins.length === 0) return;
    
    const matchedPins = pins.filter(pin => pin.isMatched).length;
    const newProgress = (matchedPins / pins.length) * 100;
    setProgress(newProgress);
    
    if (newProgress === 100 && !isCompleted) {
      setIsCompleted(true);
      gameState.updateScore(calculateLevelScore());
    }
  }, [pins, isCompleted]);

  const calculateLevelScore = () => {
    // Base score depends on difficulty
    let baseScore = difficulty === "easy" ? 50 : 
                  difficulty === "medium" ? 100 : 150;
    
    // Add bonus for remaining time
    const timeBonus = Math.floor(gameState.timer / 5);
    
    return baseScore + timeBonus;
  };

  const loadGameLevel = (difficulty: Difficulty) => {
    // Reset game state
    setIsCompleted(false);
    
    // Number of ropes, pins and holes depends on difficulty
    const ropeCount = difficulty === "easy" ? 3 : 
                     difficulty === "medium" ? 5 : 7;
    
    const includeLocks = difficulty === "hard";
    
    // Generate a game level based on difficulty
    const { 
      ropes: generatedRopes, 
      pins: generatedPins,
      pinHoles: generatedHoles,
      locks: generatedLocks,
      keys: generatedKeys 
    } = generateGameLevel(ropeCount, includeLocks, difficulty);
    
    setRopes(generatedRopes);
    setPins(generatedPins);
    setPinHoles(generatedHoles);
    setLocks(generatedLocks);
    setKeys(generatedKeys);
    setProgress(0);
  };

  const generateGameLevel = (
    ropeCount: number, 
    includeLocks: boolean,
    difficulty: Difficulty
  ) => {
    // Available colors for ropes and pins
    const colors = [
      "#FF5252", // Red
      "#4CAF50", // Green
      "#2196F3", // Blue
      "#FFC107", // Amber
      "#9C27B0", // Purple
      "#00BCD4", // Cyan
      "#FF9800"  // Orange
    ];
    
    const boardWidth = 800;
    const boardHeight = 500;
    const margin = 50;
    
    const generatedRopes: RopeSegment[] = [];
    const generatedPins: PinPosition[] = [];
    const generatedHoles: PinHolePosition[] = [];
    const generatedLocks: LockPosition[] = [];
    const generatedKeys: KeyPosition[] = [];
    
    // Determine how many additional empty pin holes to create
    const extraHolesCount = difficulty === "easy" ? 4 : 
                          difficulty === "medium" ? 2 : 0;
    
    // Create ropes, pins and holes
    for (let i = 0; i < ropeCount; i++) {
      const color = colors[i % colors.length];
      const ropeId = `rope-${i}`;
      const pinId = `pin-${i}`;
      const holeId = `hole-${i}`;
      
      // Create pin at random position
      const pinX = Math.random() * (boardWidth - 2 * margin) + margin;
      const pinY = Math.random() * (boardHeight - 2 * margin) + margin;
      
      // Create matching hole at some distance
      const holeDistance = 200 + Math.random() * 200; // Distance between 200-400px
      const holeAngle = Math.random() * 2 * Math.PI; // Random angle
      const holeX = Math.max(margin, Math.min(boardWidth - margin, 
        pinX + holeDistance * Math.cos(holeAngle)));
      const holeY = Math.max(margin, Math.min(boardHeight - margin,
        pinY + holeDistance * Math.sin(holeAngle)));
      
      // For hard difficulty, some pins require keys to unlock
      const requiresKey = includeLocks && i >= 2 && Math.random() > 0.5;
      const requiredKeyId = requiresKey ? `key-${i}` : undefined;
      
      // Add pin
      generatedPins.push({
        id: pinId,
        x: pinX,
        y: pinY,
        color,
        isMovable: !requiresKey,
        matchingHoleId: holeId,
        isMatched: false,
        requiredKeyId
      });
      
      // Add matching hole
      generatedHoles.push({
        id: holeId,
        x: holeX,
        y: holeY,
        color,
        isOccupied: false
      });
      
      // Create rope segments between pin and hole
      // For simplicity, create a rope with 3-5 segments
      const segmentCount = 2 + Math.floor(Math.random() * 3);
      const points = [{x: pinX, y: pinY}];
      
      for (let j = 1; j < segmentCount; j++) {
        // Create intermediate points for the rope
        const ratio = j / segmentCount;
        const randomOffset = (difficulty === "easy" ? 30 : 
                              difficulty === "medium" ? 60 : 90);
        
        const offsetX = (Math.random() - 0.5) * 2 * randomOffset;
        const offsetY = (Math.random() - 0.5) * 2 * randomOffset;
        
        const x = pinX + (holeX - pinX) * ratio + offsetX;
        const y = pinY + (holeY - pinY) * ratio + offsetY;
        
        points.push({x, y});
      }
      
      // Add final destination point
      points.push({x: holeX, y: holeY});
      
      generatedRopes.push({
        id: ropeId,
        points,
        color,
        pinId,
        isUntangled: false
      });
      
      // Add keys and locks for hard difficulty
      if (requiresKey) {
        // Place key near another pin's path
        const otherPinIndex = (i + 1) % ropeCount;
        const otherRopePoints = generatedRopes[otherPinIndex]?.points || [];
        
        if (otherRopePoints.length > 0) {
          const keyPoint = otherRopePoints[Math.floor(otherRopePoints.length / 2)];
          
          generatedKeys.push({
            id: `key-${i}`,
            x: keyPoint.x + (Math.random() - 0.5) * 50,
            y: keyPoint.y + (Math.random() - 0.5) * 50,
            isCollected: false
          });
          
          // Add lock near the pin
          generatedLocks.push({
            id: `lock-${i}`,
            x: pinX + 20,
            y: pinY + 20,
            isUnlocked: false,
            requiredKeyId: `key-${i}`,
            affectedPinIds: [pinId]
          });
        }
      }
    }
    
    // Add additional empty pin holes for easier difficulties
    for (let i = 0; i < extraHolesCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const holeX = Math.random() * (boardWidth - 2 * margin) + margin;
      const holeY = Math.random() * (boardHeight - 2 * margin) + margin;
      
      generatedHoles.push({
        id: `extra-hole-${i}`,
        x: holeX,
        y: holeY,
        color,
        isOccupied: false
      });
    }
    
    return {
      ropes: generatedRopes,
      pins: generatedPins,
      pinHoles: generatedHoles,
      locks: generatedLocks,
      keys: generatedKeys
    };
  };

  const handlePinDrag = (pinId: string, x: number, y: number) => {
    setPins(prevPins => 
      prevPins.map(pin => {
        if (pin.id === pinId && pin.isMovable) {
          // Update pin position
          return { ...pin, x, y, isMatched: false };
        }
        return pin;
      })
    );
    
    // Update rope points
    setRopes(prevRopes => 
      prevRopes.map(rope => {
        if (rope.pinId === pinId) {
          // Update first point of the rope
          const newPoints = [...rope.points];
          newPoints[0] = { x, y };
          return { ...rope, points: newPoints, isUntangled: false };
        }
        return rope;
      })
    );
  };

  const handlePinDrop = (pinId: string, holeId: string | null) => {
    // If no hole is found, just keep the pin at current position
    if (!holeId) return;
    
    // Find the pin and the target hole
    const pin = pins.find(p => p.id === pinId);
    const hole = pinHoles.find(h => h.id === holeId);
    
    if (!pin || !hole) return;
    
    // Check if this is the correct hole for this pin
    const isMatchingHole = pin.matchingHoleId === holeId;
    
    if (isMatchingHole) {
      // Snap the pin to the hole position
      setPins(prevPins => 
        prevPins.map(p => {
          if (p.id === pinId) {
            return { ...p, x: hole.x, y: hole.y, isMatched: true };
          }
          return p;
        })
      );
      
      // Update rope to be straight and mark as untangled
      setRopes(prevRopes => 
        prevRopes.map(rope => {
          if (rope.pinId === pinId) {
            // Create a straight rope from pin to hole
            const newPoints = [
              { x: hole.x, y: hole.y },
              { x: hole.x, y: hole.y }
            ];
            return { ...rope, points: newPoints, isUntangled: true };
          }
          return rope;
        })
      );
      
      // Mark the hole as occupied
      setPinHoles(prevHoles => 
        prevHoles.map(h => {
          if (h.id === holeId) {
            return { ...h, isOccupied: true };
          }
          return h;
        })
      );
      
      toast({
        title: "Perfect match!",
        description: "Pin placed correctly.",
      });
      
      // Award points based on difficulty
      const matchPoints = difficulty === "easy" ? 10 : 
                         difficulty === "medium" ? 15 : 20;
      gameState.updateScore(matchPoints);
    } else {
      // Incorrect hole
      toast({
        title: "Incorrect hole",
        description: "Try to find the matching colored hole.",
        variant: "destructive",
      });
    }
  };

  // Check if pin is over a key and collect it if so
  useEffect(() => {
    pins.forEach(pin => {
      keys.forEach(key => {
        if (!key.isCollected) {
          const distance = Math.sqrt(
            Math.pow(pin.x - key.x, 2) + Math.pow(pin.y - key.y, 2)
          );
          
          if (distance < 30) {
            // Collect the key
            setKeys(prevKeys => 
              prevKeys.map(k => {
                if (k.id === key.id) {
                  return { ...k, isCollected: true };
                }
                return k;
              })
            );
            
            // Unlock any locks requiring this key
            setLocks(prevLocks => 
              prevLocks.map(lock => {
                if (lock.requiredKeyId === key.id) {
                  return { ...lock, isUnlocked: true };
                }
                return lock;
              })
            );
            
            // Make associated pins movable
            setPins(prevPins => 
              prevPins.map(p => {
                if (p.requiredKeyId === key.id) {
                  return { ...p, isMovable: true, requiredKeyId: undefined };
                }
                return p;
              })
            );
            
            toast({
              title: "Key collected!",
              description: "You can now unlock pins associated with this key.",
            });
            
            // Award points for collecting a key
            gameState.updateScore(25);
          }
        }
      });
    });
  }, [pins, keys]);

  const resetGame = () => {
    setRopes([]);
    setPins([]);
    setPinHoles([]);
    setLocks([]);
    setKeys([]);
    setProgress(0);
    setIsCompleted(false);
  };

  return {
    gameBoard,
    ropes,
    pins,
    pinHoles,
    locks,
    keys,
    progress,
    isCompleted,
    handlePinDrag,
    handlePinDrop,
    resetGame,
    loadGameLevel
  };
};
