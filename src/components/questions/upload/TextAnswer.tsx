
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextAnswerProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextAnswer = ({ value, onChange }: TextAnswerProps) => {
  return (
    <div>
      <Label htmlFor="correctAnswer">Correct Answer</Label>
      <Input
        id="correctAnswer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter the correct answer"
      />
    </div>
  );
};
