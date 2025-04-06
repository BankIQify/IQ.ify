import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hairColors, skinColors, type AvatarConfig } from "./avatarConfig";

interface BasicTabProps {
  config: AvatarConfig;
  onConfigChange: (key: keyof AvatarConfig, value: string) => void;
}

export const BasicTab = ({ config, onConfigChange }: BasicTabProps) => {
  return (
    <div className="space-y-6">
      {/* Hair Colour Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-semibold font-playfair">Hair Colour</h3>
        <div className="grid grid-cols-3 gap-2">
          {hairColors.map(color => (
            <motion.button
              key={color.value}
              onClick={() => onConfigChange('facialHairColor', color.value)}
              className={cn(
                "p-2 rounded-lg flex items-center gap-2",
                config.facialHairColor === color.value
                  ? "bg-bright-pink text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={cn("w-4 h-4 rounded-full", color.className)} />
              <span className="text-xs font-medium">{color.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skin Tone Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-semibold font-playfair">Skin Tone</h3>
        <div className="grid grid-cols-3 gap-2">
          {skinColors.map(color => (
            <motion.button
              key={color.value}
              onClick={() => onConfigChange('skinColor', color.value)}
              className={cn(
                "p-2 rounded-lg flex items-center gap-2",
                config.skinColor === color.value
                  ? "bg-bright-pink text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={cn("w-4 h-4 rounded-full", color.className)} />
              <span className="text-xs font-medium">{color.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hair Style Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-semibold font-playfair">Hair Style</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'ShortHairShortWaved', label: 'Short Wavy' },
            { value: 'LongHairStraight', label: 'Long Straight' },
            { value: 'LongHairCurly', label: 'Long Curly' },
            { value: 'ShortHairTheCaesar', label: 'Caesar Cut' },
            { value: 'LongHairBun', label: 'Bun' },
            { value: 'NoHair', label: 'No Hair' },
          ].map(style => (
            <motion.button
              key={style.value}
              onClick={() => onConfigChange('topType', style.value)}
              className={cn(
                "p-2 rounded-lg text-xs font-medium",
                config.topType === style.value
                  ? "bg-bright-pink text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {style.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Facial Hair Selection */}
      <div className="space-y-2">
        <h3 className="text-white text-sm font-semibold font-playfair">Facial Hair</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'Blank', label: 'None' },
            { value: 'BeardLight', label: 'Light Beard' },
            { value: 'BeardMedium', label: 'Medium Beard' },
            { value: 'BeardMajestic', label: 'Full Beard' },
            { value: 'MoustacheFancy', label: 'Fancy Moustache' },
            { value: 'MoustacheMagnum', label: 'Magnum Moustache' },
          ].map(style => (
            <motion.button
              key={style.value}
              onClick={() => onConfigChange('facialHairType', style.value)}
              className={cn(
                "p-2 rounded-lg text-xs font-medium",
                config.facialHairType === style.value
                  ? "bg-bright-pink text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {style.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
