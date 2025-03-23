
import { GameControls } from "./GameControls";
import { ActiveGame } from "./ActiveGame";
import { GameResults } from "./GameResults";
import { useTimesTablesGame } from "./useTimesTablesGame";

const TimesTablesGame = () => {
  const {
    selectedTables,
    timeLimit,
    currentQuestion,
    userAnswer,
    answeredQuestions,
    showFeedback,
    isCorrect,
    timer,
    isActive,
    progressPercentage,
    setUserAnswer,
    handleAnswer,
    handleKeyPress,
    handleStart,
    toggleTable,
    handleTimeLimitChange,
    resetGame,
  } = useTimesTablesGame();

  return (
    <div className="space-y-6">
      {!isActive && (
        <GameControls
          selectedTables={selectedTables}
          timeLimit={timeLimit}
          onToggleTable={toggleTable}
          onTimeLimitChange={handleTimeLimitChange}
          onStart={handleStart}
        />
      )}

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
