
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KeyNameInputProps {
  keyName: string;
  setKeyName: (value: string) => void;
}

export const KeyNameInput = ({ keyName, setKeyName }: KeyNameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="keyName">Key Name</Label>
      <Input
        id="keyName"
        placeholder="e.g., Production AI, Test System"
        value={keyName}
        onChange={(e) => setKeyName(e.target.value)}
      />
    </div>
  );
};
