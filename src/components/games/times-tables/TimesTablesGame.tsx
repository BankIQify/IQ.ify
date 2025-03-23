
/**
 * TimesTablesGame is the main component that orchestrates the times tables 
 * practice game. It manages the different game states (setup, active game, 
 * and results) and renders the appropriate UI for each state.
 */
import { GameControls } from "./GameControls";
import { ActiveGame } from "./ActiveGame";
import { GameResults } from "./GameResults";
import { useTimesTablesGame } from "./useTimesTablesGame";

const TimesTablesGame = () => {
  // Use the custom hook to manage all game state and logic
  const {
    // Game configuration state
    selectedTables,
    timeLimit,
    
    // Active game state
    currentQuestion,
    userAnswer,
    answeredQuestions,
    showFeedback,
    isCorrect,
    timer,
    isActive,
    progressPercentage,
    
    // Event handlers
    setUserAnswer,
    handleAnswer,
    handleKeyPress,
    handleStartGame,
    toggleTimesTable,
    handleTimeLimitChange,
    resetGame,
  } = useTimesTablesGame();

  return (
    <div className="space-y-6">
      {/* Game setup screen - shown when game is not active */}
      {!isActive && (
        <GameControls
          selectedTables={selectedTables}
          timeLimit={timeLimit}
          onToggleTable={toggleTimesTable}
          onTimeLimitChange={handleTimeLimitChange}
          onStart={handleStartGame}
        />
      )}

      {/* Active game screen - shown when game is in progress */}
      {isActive && currentQuestion && (
        <ActiveGame
          timer={timer}
          currentQuestion={currentQuestion}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          handleAnswer={handleAnswer}
          handleKeyPress={handleKeyPress}
          showFeedback={showFeedback}
          isCorrect={isCorrect}
          progressPercentage={progressPercentage}
        />
      )}

      {/* Results screen - shown when time is up */}
      {timer === 0 && (
        <div className="animate-fade-in">
          <GameResults
            answeredQuestions={answeredQuestions}
            onReset={resetGame}
          />
        </div>
      )}
    </div>
  );
};

export default TimesTablesGame;
