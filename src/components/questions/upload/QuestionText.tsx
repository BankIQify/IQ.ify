
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QuestionTextProps {
  value: string;
  onChange: (value: string) => void;
}

export const QuestionText = ({ value, onChange }: QuestionTextProps) => {
  return (
    <div>
      <Label htmlFor="questionText">Question Text</Label>
      <Textarea
        id="questionText"
        placeholder="Enter your question..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24"
      />
    </div>
  );
};
