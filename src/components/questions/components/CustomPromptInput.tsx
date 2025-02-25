
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CustomPromptInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomPromptInput = ({ value, onChange }: CustomPromptInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">Custom Generation Prompt (Optional)</Label>
      <Textarea
        id="prompt"
        placeholder="Enter specific requirements for your questions. For example: 'Create 3 basic and 2 advanced questions about...' or 'Make questions suitable for ages 12-14...'"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-24"
      />
      <p className="text-sm text-muted-foreground">
        Leave empty for standard difficulty, or specify requirements for customized questions.
      </p>
    </div>
  );
};
