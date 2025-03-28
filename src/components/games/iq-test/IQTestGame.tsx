
import { useIQGame } from "./useIQGame";
import { GameStatsHeader } from "./GameStatsHeader";
import { QuestionDisplay } from "./QuestionDisplay";
import { ResultsSummary } from "./ResultsSummary";
import type { IQGameProps } from "./types";

const IQTestGame = ({ difficulty }: IQGameProps) => {
  const {
    gameState,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    showExplanation,
    answeredQuestions,
    questionTypes,
    handleAnswer,
    moveToNextQuestion,
    progressPercentage,
    gameQuestions,
  } = useIQGame(difficulty);
  
  if (!currentQuestion) return null;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <GameStatsHeader
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={gameQuestions.length}
        timer={gameState.timer}
        score={gameState.score}
        questionType={currentQuestion.type}
        progressPercentage={progressPercentage}
      />

      <QuestionDisplay
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        showExplanation={showExplanation}
        handleAnswer={handleAnswer}
        moveToNextQuestion={moveToNextQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={gameQuestions.length}
      />

      {answeredQuestions.length === gameQuestions.length && (
        <ResultsSummary
          score={gameState.score}
          answeredQuestions={answeredQuestions}
          totalQuestions={gameQuestions.length}
          questionTypes={questionTypes}
          onReset={() => gameState.resetGame()}
        />
      )}
    </div>
  );
};

export default IQTestGame;
