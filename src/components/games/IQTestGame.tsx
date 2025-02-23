
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import type { Difficulty } from "@/components/games/GameSettings";
import { useGameState } from "@/hooks/use-game-state";

interface Question {
  id: number;
  type: 'pattern' | 'numerical' | 'logical';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
}

// Questions database with varying difficulty levels
const QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'numerical',
    question: "What number comes next in the sequence: 2, 4, 8, 16, ...",
    options: ["24", "32", "28", "30"],
    correctAnswer: "32",
    explanation: "Each number is doubled to get the next number in the sequence.",
    difficulty: "easy"
  },
  {
    id: 2,
    type: 'logical',
    question: "If all roses are flowers and some flowers fade quickly, then:",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade quickly",
      "Roses never fade"
    ],
    correctAnswer: "Some roses may fade quickly",
    explanation: "This is a logical deduction. Since only some flowers fade quickly, and roses are flowers, we can only conclude that some roses MAY fade quickly.",
    difficulty: "easy"
  },
  {
    id: 3,
    type: 'pattern',
    question: "If ⭐️ = 5, 🌙 = 3, and ☀️ = 4, then ⭐️ + 🌙 + ☀️ = ?",
    options: ["10", "12", "15", "8"],
    correctAnswer: "12",
    explanation: "⭐️(5) + 🌙(3) + ☀️(4) = 12",
    difficulty: "easy"
  },
  {
    id: 4,
    type: 'numerical',
    question: "What number comes next: 1, 4, 9, 16, 25, ...",
    options: ["30", "36", "42", "49"],
    correctAnswer: "36",
    explanation: "These are square numbers: 1², 2², 3², 4², 5², 6²",
    difficulty: "medium"
  },
  {
    id: 5,
    type: 'pattern',
    question: "Complete the pattern: AABABC, AABABC, AAB...",
    options: ["ABC", "CAB", "BAC", "ACB"],
    correctAnswer: "ABC",
    explanation: "The pattern AABABC repeats, so after AAB comes ABC",
    difficulty: "medium"
  },
  {
    id: 6,
    type: 'logical',
    question: "All mammals are warm-blooded. No reptiles are mammals. Therefore:",
    options: [
      "All reptiles are cold-blooded",
      "Some reptiles are warm-blooded",
      "No warm-blooded animals are reptiles",
      "Some mammals are reptiles"
    ],
    correctAnswer: "No warm-blooded animals are reptiles",
    explanation: "Since all mammals are warm-blooded and no reptiles are mammals, we can deduce that no reptiles are warm-blooded animals.",
    difficulty: "hard"
  }
];

export const IQTestGame = ({ difficulty }: { difficulty: Difficulty }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { toast } = useToast();

  const gameState = useGameState({
    initialTimer: 300,
    gameType: "word_search", // We'll update the game_type enum in the database later
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
