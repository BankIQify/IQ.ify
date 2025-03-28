
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExamNameInputProps {
  customName: string;
  setCustomName: (name: string) => void;
}

export function ExamNameInput({ customName, setCustomName }: ExamNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="customName">Exam Name</Label>
      <Input
        id="customName"
        value={customName}
        onChange={(e) => setCustomName(e.target.value)}
        placeholder="Enter exam name"
      />
    </div>
  );
}
