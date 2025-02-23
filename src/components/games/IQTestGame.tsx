
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import type { Difficulty } from "@/components/games/GameSettings";
import { useGameState } from "@/hooks/use-game-state";
import type { Question } from "@/types/iq-test";
import { QUESTIONS } from "@/data/iq-test-questions";

const IQTestGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { toast } = useToast();

  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
    onGameOver: () => {
      handleGameOver();
    },
  });

  const filteredQuestions = QUESTIONS.filter(q => q.difficulty === difficulty);
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    gameState.startGame();
    // Reset game state when difficulty changes
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setAnsweredQuestions([]);
  }, [difficulty]);

  const handleAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must choose an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      gameState.updateScore(10);
      toast({
        title: "Correct!",
        description: "Well done! Let's see the explanation.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "Let's see why. Don't worry, learning from mistakes is part of improving!",
        variant: "destructive",
      });
    }

    setShowExplanation(true);
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    const totalQuestions = filteredQuestions.length;
    const answeredCount = answeredQuestions.length;
    const accuracy = Math.round((gameState.score / (answeredCount * 10)) * 100);

    toast({
      title: "Game Complete!",
      description: `You scored ${gameState.score} points with ${accuracy}% accuracy. Keep practicing to improve your IQ!`,
    });
    
    gameState.resetGame();
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {filteredQuestions.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Time: {gameState.timer}s
          </span>
          <span className="text-sm text-muted-foreground">
            Score: {gameState.score}
          </span>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={showExplanation}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {showExplanation ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-semibold">Explanation:</p>
                <p className="text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="w-full"
              >
                {currentQuestionIndex < filteredQuestions.length - 1
                  ? "Next Question"
                  : "Finish Game"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAnswer}
              className="w-full"
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default IQTestGame;

