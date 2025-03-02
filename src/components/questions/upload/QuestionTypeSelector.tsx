
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type QuestionType = Database["public"]["Enums"]["question_type"];

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}

export const QuestionTypeSelector = ({ value, onChange }: QuestionTypeSelectorProps) => {
  return (
    <div>
      <Label>Question Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="dual_choice">Dual Choice</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
