
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  id: string;
  label: string;
  required?: boolean;
  onChange: (file: File | null) => void;
}

export const ImageUpload = ({ id, label, required, onChange }: ImageUploadProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div>
      <Label htmlFor={id}>{label} {required ? "(Required)" : "(Optional)"}</Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="mt-1"
      />
    </div>
  );
};
