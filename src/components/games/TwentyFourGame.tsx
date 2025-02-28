
import { useState } from "react";
import { GameLayout } from "@/components/games/GameLayout";
import { useGameState } from "@/hooks/use-game-state";
import { GameInstructions } from "./twenty-four/GameInstructions";
import { PuzzleDisplay } from "./twenty-four/PuzzleDisplay";
import { GameControls } from "./twenty-four/GameControls";
import { GameCompletedModal } from "./twenty-four/GameCompletedModal";
import { useTwentyFourGameLogic } from "./twenty-four/TwentyFourGameLogic";
import type { Difficulty } from "@/components/games/GameSettings";
import type { TwentyFourGameType } from "./twenty-four/types";

// Define props interface for the component
export interface TwentyFourGameProps {
  difficulty?: Difficulty;
}

export const TwentyFourGame = ({ difficulty = "easy" }: TwentyFourGameProps) => {
  const [showGameCompleted, setShowGameCompleted] = useState(false);

  const gameType: TwentyFourGameType = "twenty_four";
  
  const gameState = useGameState({
    gameType,
    initialTimer: 300, // 5 minutes
    onGameOver: () => setShowGameCompleted(true),
  });

  const handleGameCompleted = () => {
    setShowGameCompleted(true);
    gameState.pauseGame();
  };

  const gameLogic = useTwentyFourGameLogic({
    gameState,
    onGameCompleted: handleGameCompleted,
    difficulty: gameState.difficulty
  });

  const handleRestartGame = () => {
    setShowGameCompleted(false);
    gameState.resetGame();
  };

  if (gameLogic.loading) {
    return (
      <GameLayout
        title="24 Game"
        description="Use four numbers and arithmetic operations to reach 24."
        score={gameState.score}
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        onStart={gameLogic.loadPuzzles}
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

  if (gameLogic.puzzles.length === 0 && !gameLogic.loading) {
    return (
      <GameLayout
        title="24 Game"
        description="Use four numbers and arithmetic operations to reach 24."
        score={gameState.score}
        timer={gameState.timer}
        difficulty={gameState.difficulty}
        onStart={gameLogic.loadPuzzles}
        onPause={gameState.pauseGame}
        onReset={gameState.resetGame}
        onDifficultyChange={gameState.setDifficulty}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <p>No puzzles available for the selected difficulty.</p>
          <button 
            onClick={gameLogic.loadPuzzles} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
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
      onStart={gameLogic.handleStartGame}
      onPause={gameState.pauseGame}
      onReset={gameState.resetGame}
      onDifficultyChange={gameState.setDifficulty}
    >
      {gameState.isActive ? (
        <>
          {gameLogic.puzzles.length > 0 && (
            <PuzzleDisplay 
              puzzle={gameLogic.puzzles[gameLogic.currentPuzzleIndex]} 
              currentIndex={gameLogic.currentPuzzleIndex}
              totalPuzzles={gameLogic.puzzles.length}
            />
          )}
          
          <GameControls 
            userAnswer={gameLogic.userAnswer}
            onAnswerChange={gameLogic.setUserAnswer}
            onSubmit={gameLogic.handleSubmitAnswer}
            onSkip={gameLogic.handleSkipPuzzle}
            onShowSolution={gameLogic.handleShowSolution}
            showSolution={gameLogic.showSolution}
            solution={gameLogic.puzzles[gameLogic.currentPuzzleIndex]?.solution}
          />
        </>
      ) : (
        <GameInstructions />
      )}

      {showGameCompleted && (
        <GameCompletedModal
          score={gameState.score}
          solvedCount={gameLogic.solvedPuzzles.length}
          totalPuzzles={gameLogic.puzzles.length}
          onRestart={handleRestartGame}
        />
      )}
    </GameLayout>
  );
};
