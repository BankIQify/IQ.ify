
import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { GameLayout } from "./GameLayout";
import { GameSettings } from "./GameSettings";
import type { Difficulty } from "./GameSettings";
import { RopeUntangleBoard } from "./rope-untangle/RopeUntangleBoard";
import { GameInstructions } from "./rope-untangle/GameInstructions";
import { GameCompletedModal } from "./rope-untangle/GameCompletedModal";
import { useRopeUntangleGame } from "./rope-untangle/useRopeUntangleGame";

export const RopeUntangleGame = ({ difficulty: initialDifficulty = "easy" }: { difficulty?: Difficulty }) => {
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const gameState = useGameState({
    initialTimer: initialDifficulty === "easy" ? 300 : initialDifficulty === "medium" ? 180 : 120,
    gameType: "rope_untangle",
    onGameOver: () => setShowCompletedModal(true),
  });

  const {
    gameBoard,
    ropes,
    pins,
    pinHoles,
    locks,
    keys,
    handlePinDrag,
    handlePinDrop,
    progress,
    isCompleted,
    resetGame,
    loadGameLevel,
  } = useRopeUntangleGame(gameState.difficulty, gameState);

  const handleGameStart = () => {
    resetGame();
    loadGameLevel(gameState.difficulty);
    gameState.startGame();
  };

  const handleGameCompleted = () => {
    setShowCompletedModal(true);
    gameState.pauseGame();
  };

  const handleRestartGame = () => {
    setShowCompletedModal(false);
    gameState.resetGame();
    resetGame();
  };

  const settingsContent = (
    <div className="space-y-4">
      <GameSettings
        difficulty={gameState.difficulty}
        onDifficultyChange={gameState.setDifficulty}
      />
      <div className="pt-4">
        <button
          onClick={handleGameStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );

  return (
    <GameLayout
      title="Rope Untangle"
      description="Untangle the ropes by moving the pins to their matching pin-holes"
      score={gameState.score}
      timer={gameState.isActive ? gameState.timer : undefined}
      difficulty={gameState.difficulty}
      onReset={gameState.resetGame}
      settingsContent={settingsContent}
    >
      {!gameState.isActive ? (
        <GameInstructions onStart={handleGameStart} />
      ) : (
        <RopeUntangleBoard
          gameBoard={gameBoard}
          ropes={ropes}
          pins={pins}
          pinHoles={pinHoles}
          locks={locks}
          keys={keys}
          onPinDrag={handlePinDrag}
          onPinDrop={handlePinDrop}
          progress={progress}
          onCompleted={handleGameCompleted}
          difficulty={gameState.difficulty}
        />
      )}

      {showCompletedModal && (
        <GameCompletedModal
          score={gameState.score}
          solvedPercentage={progress}
          onRestart={handleRestartGame}
          difficulty={gameState.difficulty}
        />
      )}
    </GameLayout>
  );
};

export default RopeUntangleGame;
