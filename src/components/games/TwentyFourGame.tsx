
import { useState, useEffect } from "react";
import { GameLayout } from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGameState } from "@/hooks/use-game-state";
import { supabase } from "@/integrations/supabase/client";
import { PuzzleCard } from "./twenty-four/PuzzleCard";
import { GameCompletedModal } from "./twenty-four/GameCompletedModal";
import { useToast } from "@/hooks/use-toast";

export interface TwentyFourPuzzle {
  id: string;
  numbers: number[];
  solution?: string;
}

export const TwentyFourGame = () => {
  const [puzzles, setPuzzles] = useState<TwentyFourPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showGameCompleted, setShowGameCompleted] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const { toast } = useToast();

  const gameState = useGameState({
    gameType: "times_tables", // Using an existing game type as a workaround
    initialTimer: 300, // 5 minutes
    onGameOver: () => setShowGameCompleted(true),
  });

  // Fetch puzzles when the component mounts
  useEffect(() => {
    fetchPuzzles();
  }, []);

  const fetchPuzzles = async () => {
    try {
      const { data, error } = await supabase
        .from("game_puzzles")
        .select("id, puzzle_data")
        .eq("game_type", "twenty_four")
        .eq("difficulty", gameState.difficulty)
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedPuzzles = data.map((item) => {
          const puzzleData = typeof item.puzzle_data === 'string' ? 
            JSON.parse(item.puzzle_data) : item.puzzle_data;
            
          return {
            id: item.id,
            numbers: puzzleData.numbers || [],
            solution: puzzleData.solution,
          };
        });
        setPuzzles(mappedPuzzles);
      } else {
        toast({
          title: "No puzzles found",
          description: "Try a different difficulty level or check back later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      toast({
        title: "Error",
        description: "Failed to load puzzles. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartGame = () => {
    setCurrentPuzzleIndex(0);
    setSolvedPuzzles([]);
    setUserAnswer("");
    setShowSolution(false);
    gameState.startGame();
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please enter your answer",
        variant: "destructive",
      });
      return;
    }

    try {
      // Evaluate the user's expression
      const result = evaluateExpression(userAnswer, puzzles[currentPuzzleIndex].numbers);
      
      if (result === 24) {
        toast({
          title: "Correct!",
          description: "Your solution is correct!",
        });
        
        // Mark this puzzle as solved
        setSolvedPuzzles((prev) => [...prev, puzzles[currentPuzzleIndex].id]);
        
        // Award points
        gameState.updateScore(10);
        
        // Move to the next puzzle
        moveToNextPuzzle();
      } else {
        toast({
          title: "Incorrect",
          description: `Your solution equals ${result}, not 24. Try again!`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Invalid Expression",
        description: "Please enter a valid mathematical expression using only the given numbers.",
        variant: "destructive",
      });
    }
  };

  const evaluateExpression = (expression: string, allowedNumbers: number[]): number => {
    // Remove all whitespace
    const cleanExpression = expression.replace(/\s/g, "");
    
    // Check if expression only contains allowed characters
    if (!/^[0-9+\-*/()]+$/.test(cleanExpression)) {
      throw new Error("Expression contains invalid characters");
    }
    
    // Check if expression uses only the allowed numbers
    const numbersInExpression = cleanExpression.match(/\d+/g) || [];
    const expressionNumbers = numbersInExpression.map(Number);
    
    // Sort both arrays to compare
    const sortedAllowedNumbers = [...allowedNumbers].sort();
    const sortedExpressionNumbers = [...expressionNumbers].sort();
    
    if (JSON.stringify(sortedExpressionNumbers) !== JSON.stringify(sortedAllowedNumbers)) {
      throw new Error("Expression uses incorrect numbers");
    }
    
    // Evaluate the expression
    try {
      // Note: Using eval is generally not recommended, but for a simple game calculator
      // with careful input validation it can be acceptable
      // eslint-disable-next-line no-eval
      return eval(cleanExpression);
    } catch (e) {
      throw new Error("Invalid expression");
    }
  };

  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setUserAnswer("");
      setShowSolution(false);
    } else {
      // All puzzles completed
      setShowGameCompleted(true);
      gameState.pauseGame();
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    // Penalty for seeing the solution
    gameState.updateScore(-5);
  };

  const handleSkipPuzzle = () => {
    // Penalty for skipping
    gameState.updateScore(-3);
    moveToNextPuzzle();
  };

  const handleRestartGame = () => {
    setShowGameCompleted(false);
    gameState.resetGame();
  };

  if (puzzles.length === 0) {
    return (
      <GameLayout
        title="24 Game"
        description="Use four numbers and arithmetic operations to reach 24."
        score={gameState.score}
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        onStart={fetchPuzzles}
        onPause={gameState.pauseGame}
        onReset={gameState.resetGame}
        onDifficultyChange={gameState.setDifficulty}
      >
        <div className="flex items-center justify-center h-full">
          <p>Loading puzzles...</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout
      title="24 Game"
      description="Use four numbers and arithmetic operations to reach 24."
      score={gameState.score}
      timer={gameState.timer}
      difficulty={gameState.difficulty}
      onStart={handleStartGame}
      onPause={gameState.pauseGame}
      onReset={gameState.resetGame}
      onDifficultyChange={gameState.setDifficulty}
    >
      {gameState.isActive ? (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <p className="text-sm mb-2">
              Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
            </p>
            <h2 className="text-xl font-bold">
              Make 24 using these four numbers
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Use each number exactly once and any of +, -, *, / and parentheses.
            </p>
          </div>

          <div className="flex justify-center gap-4 my-8">
            {puzzles[currentPuzzleIndex]?.numbers.map((number, idx) => (
              <PuzzleCard key={idx} number={number} />
            ))}
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your solution (e.g. 3*(8-4)+6)"
                className="flex-1"
              />
              <Button onClick={handleSubmitAnswer}>Submit</Button>
            </div>

            {showSolution ? (
              <Card className="p-4 bg-green-50">
                <p className="font-medium">Solution:</p>
                <p className="text-green-600">{puzzles[currentPuzzleIndex]?.solution}</p>
              </Card>
            ) : (
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleSkipPuzzle}>
                  Skip (-3 points)
                </Button>
                <Button variant="outline" onClick={handleShowSolution}>
                  Show Solution (-5 points)
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-xl font-bold">24 Game</h2>
          <p className="text-gray-500 text-center max-w-md">
            Using only addition, subtraction, multiplication, and division, make the number 24 from the four numbers on the cards. Use each number exactly once.
          </p>
          <Button size="lg" onClick={handleStartGame}>
            Start Game
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mt-2">
                How to Play
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">How to Play</h3>
                <p className="text-sm">
                  1. You'll be shown four numbers from 1-10.
                </p>
                <p className="text-sm">
                  2. Your goal is to use all four numbers exactly once with basic operations (+, -, *, /) to make 24.
                </p>
                <p className="text-sm">
                  3. You can use parentheses to control the order of operations.
                </p>
                <p className="text-sm">
                  4. Example: For cards 3, 4, 6, and 8, one solution is: (8 / 4) * (6 + 3) = 2 * 9 = 18
                </p>
                <p className="text-sm font-medium">
                  Scoring:
                </p>
                <p className="text-sm">
                  • +10 points for each correct solution
                </p>
                <p className="text-sm">
                  • -3 points for skipping a puzzle
                </p>
                <p className="text-sm">
                  • -5 points for viewing the solution
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {showGameCompleted && (
        <GameCompletedModal
          score={gameState.score}
          solvedCount={solvedPuzzles.length}
          totalPuzzles={puzzles.length}
          onRestart={handleRestartGame}
        />
      )}
    </GameLayout>
  );
};
