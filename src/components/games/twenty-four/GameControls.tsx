
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface GameControlsProps {
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onShowSolution: () => void;
  showSolution: boolean;
  solution?: string;
}

export const GameControls = ({
  userAnswer,
  onAnswerChange,
  onSubmit,
  onSkip,
  onShowSolution,
  showSolution,
  solution
}: GameControlsProps) => {
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please enter your answer",
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Enter your solution (e.g. 3*(8-4)+6)"
          className="flex-1"
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>

      {showSolution ? (
        <Card className="p-4 bg-green-50">
          <p className="font-medium">Solution:</p>
          <p className="text-green-600">{solution}</p>
        </Card>
      ) : (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onSkip}>
            Skip (-3 points)
          </Button>
          <Button variant="outline" onClick={onShowSolution}>
            Show Solution (-5 points)
          </Button>
        </div>
      )}
    </div>
  );
};
