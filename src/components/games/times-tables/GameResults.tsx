
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { Question } from "./types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface GameResultsProps {
  answeredQuestions: Question[];
  onReset: () => void;
}

export const GameResults = ({ answeredQuestions, onReset }: GameResultsProps) => {
  const correctAnswers = answeredQuestions.filter((q) => q.isCorrect).length;
  const totalQuestions = answeredQuestions.length;
  const percentageCorrect = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const incorrectQuestions = answeredQuestions.filter((q) => !q.isCorrect);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold">Game Complete!</h3>
        <div className="flex items-center justify-center gap-2 text-xl">
          <span>Score: </span>
          <span className="font-bold">{correctAnswers} / {totalQuestions}</span>
          <span className="text-muted-foreground">({percentageCorrect}%)</span>
        </div>
      </div>
      
      {incorrectQuestions.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">Incorrect Answers:</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Your Answer</TableHead>
                <TableHead>Correct Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incorrectQuestions.map((q, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {q.operation === "multiply"
                      ? `${q.num1} × ${q.num2}`
                      : `${q.num1} ÷ ${q.num2}`}
                  </TableCell>
                  <TableCell className="text-destructive font-medium">
                    <div className="flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {q.userAnswer}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {q.answer}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        totalQuestions > 0 && (
          <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Check className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-green-700 font-medium">Perfect Score! All answers correct.</p>
          </div>
        )
      )}
      
      <div className="flex justify-center">
        <Button onClick={onReset} size="lg">
          Try Again
        </Button>
      </div>
    </div>
  );
};
