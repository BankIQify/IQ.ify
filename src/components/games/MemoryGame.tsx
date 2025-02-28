
import { useState, useEffect } from "react";
import { Square, Circle, Triangle, Star, Trophy } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Shape = "square" | "circle" | "triangle" | "star";

interface Card {
  id: number;
  shape: Shape;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  difficulty: Difficulty;
}

const SHAPES: Shape[] = ["square", "circle", "triangle", "star"];

const ShapeIcon = ({ shape, className }: { shape: Shape; className?: string }) => {
  switch (shape) {
    case "square":
      return <Square className={className} />;
    case "circle":
      return <Circle className={className} />;
    case "triangle":
      return <Triangle className={className} />;
    case "star":
      return <Star className={className} />;
  }
};

export const MemoryGame = ({ difficulty }: MemoryGameProps) => {
  const { score, updateScore, timer, startGame, resetGame, isActive } = useGameState({
    initialTimer: 300,
    gameType: "word_search",
  });

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const allShapes = [...SHAPES, ...SHAPES, ...SHAPES, ...SHAPES, 
                      ...SHAPES, ...SHAPES, ...SHAPES, ...SHAPES];
    const shuffledCards = allShapes
      .sort(() => Math.random() - 0.5)
      .map((shape, index) => ({
        id: index,
        shape,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setIsGameComplete(false);
    resetGame();
  };

  const handleCardClick = (id: number) => {
    if (!isActive) {
      startGame();
    }

    if (
      flippedCards.length === 2 ||
      flippedCards.includes(id) ||
      cards[id].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].shape === cards[secondId].shape) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedPairs((prev) => {
          const newValue = prev + 1;
          if (newValue === 16) {
            setIsGameComplete(true);
          }
          return newValue;
        });
        updateScore(10);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const progressValue = (matchedPairs / 16) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-pastel-purple/20 to-pastel-blue/20 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Pairs Found</span>
          <span className="text-xl font-bold">{matchedPairs} / 16</span>
        </div>
        
        <div className="flex-1">
          <Progress value={progressValue} className="h-3 bg-pastel-gray/50" />
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="text-xl font-bold">{score}</span>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 max-w-3xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square cursor-pointer transition-all duration-500 transform perspective-1000 hover:scale-105",
              "shadow-md rounded-lg",
              card.isMatched && "opacity-80"
            )}
          >
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500",
                  "bg-gradient-to-br from-pastel-purple/80 to-pastel-blue/80 border-2 border-white rounded-lg flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-180 opacity-0"
                    : ""
                )}
              >
                <div className="w-6 h-6 bg-white/30 rounded-full"></div>
              </div>
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-500 rotate-y-180",
                  "bg-white border-2 rounded-lg flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-0 opacity-100"
                    : "opacity-0",
                  card.isMatched && "bg-pastel-green/20"
                )}
              >
                <ShapeIcon
                  shape={card.shape}
                  className={cn(
                    "w-8 h-8",
                    card.shape === "square" && "text-blue-500",
                    card.shape === "circle" && "text-red-500",
                    card.shape === "triangle" && "text-green-500",
                    card.shape === "star" && "text-yellow-500"
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isGameComplete && (
        <div className="mt-8 text-center animate-scale-in">
          <div className="bg-gradient-to-r from-pastel-green to-pastel-blue p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">Congratulations!</h3>
            <p className="text-lg text-white/90 mb-4">You've completed the game with a score of {score}!</p>
            <Button
              onClick={initializeGame}
              className="bg-white text-primary hover:bg-white/90 transition-colors"
              size="lg"
            >
              Play Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
