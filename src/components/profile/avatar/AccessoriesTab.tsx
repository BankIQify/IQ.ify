
import { Label } from "@/components/ui/label";
import { type AvatarConfig } from "./avatarConfig";

interface AccessoriesTabProps {
  config: AvatarConfig;
  updateAvatarConfig: (key: keyof AvatarConfig, value: any) => void;
}

export const AccessoriesTab = ({ config, updateAvatarConfig }: AccessoriesTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="glasses"
            checked={config.glasses}
            onChange={(e) => updateAvatarConfig('glasses', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="glasses">Glasses</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="earrings"
            checked={config.earrings}
            onChange={(e) => updateAvatarConfig('earrings', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="earrings">Earrings</Label>
        </div>
      </div>
    </div>
  );
};
