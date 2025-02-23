
import { useState, useEffect } from "react";
import { Square, Circle, Triangle, Star } from "lucide-react";
import { useGameState } from "@/hooks/use-game-state";
import type { Difficulty } from "@/components/games/GameSettings";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    initializeGame();
  }, []);

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
        setMatchedPairs((prev) => prev + 1);
        updateScore(10);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-8 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "aspect-square rounded-lg cursor-pointer transition-all duration-300 transform perspective-1000",
              "hover:scale-105",
              card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                ? "rotate-y-180"
                : ""
            )}
          >
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-300",
                  "bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-180 opacity-0"
                    : ""
                )}
              >
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
              </div>
              <div
                className={cn(
                  "absolute w-full h-full backface-hidden transition-transform duration-300 rotate-y-180",
                  "bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center",
                  (card.isFlipped || card.isMatched || flippedCards.includes(card.id))
                    ? "rotate-y-0 opacity-100"
                    : "opacity-0"
                )}
              >
                <ShapeIcon
                  shape={card.shape}
                  className={cn(
                    "w-6 h-6",
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

      {matchedPairs === 32 && (
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-green-600">Congratulations!</h3>
          <p className="text-lg">You've completed the game with a score of {score}!</p>
          <button
            onClick={initializeGame}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};
