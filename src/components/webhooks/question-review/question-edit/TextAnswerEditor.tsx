
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextAnswerEditorProps {
  correctAnswer: string;
  onCorrectAnswerChange: (value: string) => void;
  index: number;
}

export const TextAnswerEditor = ({ 
  correctAnswer, 
  onCorrectAnswerChange, 
  index 
}: TextAnswerEditorProps) => {
  return (
    <div>
      <Label htmlFor={`correctAnswer-${index}`}>Correct Answer</Label>
      <Input
        id={`correctAnswer-${index}`}
        value={correctAnswer || ""}
        onChange={(e) => onCorrectAnswerChange(e.target.value)}
        className="mt-1"
      />
    </div>
  );
};
