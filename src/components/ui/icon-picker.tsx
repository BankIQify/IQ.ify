import * as React from "react";
import * as Icons from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const iconNames = Object.keys(Icons).filter(
    (key) => typeof Icons[key as keyof typeof Icons] === "function" && key !== "createLucideIcon"
  );

  const SelectedIcon = Icons[value as keyof typeof Icons] as React.FC<Icons.LucideProps>;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            {SelectedIcon && <SelectedIcon className="w-4 h-4" />}
            <span>{value}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {iconNames.map((iconName) => {
          const Icon = Icons[iconName as keyof typeof Icons] as React.FC<Icons.LucideProps>;
          return (
            <SelectItem key={iconName} value={iconName}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                <span>{iconName}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}; 