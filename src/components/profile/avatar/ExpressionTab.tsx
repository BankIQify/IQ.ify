
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { moods, type AvatarConfig } from "./avatarConfig";

interface ExpressionTabProps {
  config: AvatarConfig;
  updateAvatarConfig: (key: keyof AvatarConfig, value: any) => void;
}

export const ExpressionTab = ({ config, updateAvatarConfig }: ExpressionTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Mood</Label>
        <RadioGroup 
          value={config.mood} 
          onValueChange={(value: any) => updateAvatarConfig('mood', value)}
          className="flex flex-wrap gap-4"
        >
          {moods.map((mood) => (
            <div key={mood.value} className="flex items-center space-x-2">
              <RadioGroupItem value={mood.value} id={mood.value} />
              <Label htmlFor={mood.value}>{mood.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
