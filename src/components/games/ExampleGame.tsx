
import { GameLayout } from "./GameLayout";
import { GameSettings } from "./GameSettings";
import { useGameState } from "@/hooks/use-game-state";

export const ExampleGame = () => {
  const {
    score,
    timer,
    isActive,
    difficulty,
    startGame,
    resetGame,
    setDifficulty,
  } = useGameState({
    gameType: "word_search",
    initialTimer: 300,
  });

  return (
    <GameLayout
      title="Word Search"
      description="Find hidden words in the grid"
      score={score}
      timer={timer}
      onReset={resetGame}
      settingsContent={
        <GameSettings
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      }
    >
      <div className="space-y-4">
        {!isActive ? (
          <button
            onClick={startGame}
            className="w-full bg-primary text-primary-foreground p-2 rounded"
          >
            Start Game
          </button>
        ) : (
          <div>
            {/* Game content will go here */}
            <p className="text-center">Game in progress...</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
};
