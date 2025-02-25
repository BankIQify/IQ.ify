
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomPromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomPromptInput = ({ value, onChange }: CustomPromptInputProps) => {
  return (
    <div>
      <Label htmlFor="prompt">Custom Generation Prompt (Optional)</Label>
      <Textarea
        id="prompt"
        placeholder="Enter a custom prompt for question generation..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24"
      />
    </div>
  );
};
