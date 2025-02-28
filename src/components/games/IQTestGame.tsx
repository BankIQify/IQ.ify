
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
import { Brain, Timer, Trophy, Star, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const IQTestGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [questionTypes, setQuestionTypes] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search",
    onGameOver: () => {
      handleGameOver();
    },
  });

  useEffect(() => {
    // Get questions for the current difficulty
    const questionsForDifficulty = QUESTIONS.filter(q => q.difficulty === difficulty);
    
    // Randomly select 15 questions
    const shuffled = [...questionsForDifficulty].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 15);
    
    // If we don't have enough questions for the difficulty, pad with random questions from other difficulties
    if (selected.length < 15) {
      const remainingQuestions = QUESTIONS
        .filter(q => q.difficulty !== difficulty)
        .sort(() => Math.random() - 0.5)
        .slice(0, 15 - selected.length);
      
      selected.push(...remainingQuestions);
    }
    
    // Count question types for the statistics
    const types: Record<string, number> = {};
    selected.forEach(q => {
      if (!types[q.type]) types[q.type] = 0;
      types[q.type]++;
    });
    
    setQuestionTypes(types);
    setGameQuestions(selected);
    
    // Reset game state when difficulty changes
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setAnsweredQuestions([]);
    gameState.startGame();
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

    const currentQuestion = gameQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    const totalQuestions = gameQuestions.length;
    const answeredCount = answeredQuestions.length;
    const accuracy = Math.round((gameState.score / (answeredCount * 10)) * 100) || 0;

    toast({
      title: "Test Complete!",
      description: `You scored ${gameState.score} points with ${accuracy}% accuracy. Keep practicing to improve your IQ!`,
    });
    
    gameState.resetGame();
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];
  
  if (!currentQuestion) return null;
  
  const progressPercentage = ((currentQuestionIndex + 1) / gameQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-pastel-purple/30 to-pastel-blue/30 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-medium">
              Question {currentQuestionIndex + 1} of {gameQuestions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Time: {gameState.timer}s
            </span>
          </div>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-2" />
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Type: <span className="capitalize">{currentQuestion.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{gameState.score} points</span>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-pastel-blue/5 to-pastel-purple/5 border-b">
          <h3 className="text-lg font-semibold">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="p-6">
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-4"
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-lg transition-colors",
                  showExplanation && option === currentQuestion.correctAnswer ? "bg-green-50" : "",
                  showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "bg-red-50" : "",
                  !showExplanation && "hover:bg-gray-50"
                )}
              >
                <RadioGroupItem
                  value={option}
                  id={`option-${index}`}
                  disabled={showExplanation}
                  className={cn(
                    showExplanation && option === currentQuestion.correctAnswer ? "border-green-500 text-green-500" : "",
                    showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "border-red-500 text-red-500" : ""
                  )}
                />
                <Label 
                  htmlFor={`option-${index}`}
                  className={cn(
                    "cursor-pointer w-full",
                    showExplanation && option === currentQuestion.correctAnswer ? "text-green-700 font-medium" : "",
                    showExplanation && selectedAnswer === option && option !== currentQuestion.correctAnswer ? "text-red-700" : ""
                  )}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showExplanation ? (
            <div className="space-y-4 mt-6 animate-fade-in">
              <div className="p-4 bg-pastel-blue/10 rounded-lg border border-pastel-blue/30">
                <h4 className="font-semibold mb-1">Explanation:</h4>
                <p className="text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
              >
                {currentQuestionIndex < gameQuestions.length - 1 ? (
                  <span className="flex items-center gap-1">
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </span>
                ) : (
                  "Finish Test"
                )}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAnswer}
              className="w-full mt-6 bg-gradient-to-r from-pastel-purple to-pastel-blue hover:opacity-90"
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          )}
        </div>
      </Card>

      {answeredQuestions.length === gameQuestions.length && (
        <div className="bg-gradient-to-r from-pastel-green to-pastel-blue p-6 rounded-xl shadow-md text-white animate-scale-in">
          <div className="flex gap-4 items-center">
            <Trophy className="h-12 w-12 text-yellow-300" />
            <div>
              <h3 className="text-2xl font-bold">Test Complete!</h3>
              <p className="opacity-90">
                You scored {gameState.score} points with a {Math.round((gameState.score / (answeredQuestions.length * 10)) * 100)}% accuracy.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            {Object.entries(questionTypes).map(([type, count]) => (
              <div key={type} className="bg-white/20 p-3 rounded-lg">
                <h4 className="text-sm uppercase opacity-80">{type}</h4>
                <p className="text-lg font-medium">{count} questions</p>
              </div>
            ))}
          </div>
          
          <Button
            onClick={() => gameState.resetGame()}
            className="w-full mt-6 bg-white text-primary hover:bg-white/90"
          >
            Start New Test
          </Button>
        </div>
      )}
    </div>
  );
};

export default IQTestGame;
