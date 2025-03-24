
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { hairColors, skinColors, type AvatarConfig } from "./avatarConfig";

interface BasicTabProps {
  config: AvatarConfig;
  updateAvatarConfig: (key: keyof AvatarConfig, value: any) => void;
}

export const BasicTab = ({ config, updateAvatarConfig }: BasicTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Gender</Label>
        <RadioGroup 
          value={config.gender} 
          onValueChange={(value) => updateAvatarConfig('gender', value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label className="block mb-2">Skin Tone</Label>
        <div className="flex space-x-2">
          {skinColors.map((skin) => (
            <button
              key={skin.value}
              onClick={() => updateAvatarConfig('skinColor', skin.value)}
              className={`w-10 h-10 rounded-full ${skin.className} ${
                config.skinColor === skin.value ? 'ring-2 ring-offset-2 ring-education-600' : ''
              }`}
              title={skin.label}
            />
          ))}
        </div>
      </div>
      
      <div>
        <Label className="block mb-2">Hair Color</Label>
        <div className="flex space-x-2">
          {hairColors.map((hair) => (
            <button
              key={hair.value}
              onClick={() => updateAvatarConfig('hairColor', hair.value)}
              className={`w-10 h-10 rounded-full ${hair.className} ${
                config.hairColor === hair.value ? 'ring-2 ring-offset-2 ring-education-600' : ''
              }`}
              title={hair.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
