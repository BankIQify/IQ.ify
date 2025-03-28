import { useEffect } from 'react';
import { Confetti } from '../../components/ui/child-friendly/Confetti';
import { cn } from '@/lib/utils';
import type { AchievementUnlockAlert as AlertType } from '@/types/achievements/types';
import { X } from 'lucide-react';

interface AchievementUnlockAlertProps {
  alert: AlertType;
  onClose: () => void;
}

const ALERT_COLORS = {
  sticker: {
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    shadow: 'shadow-emerald-100'
  },
  medal: {
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    shadow: 'shadow-blue-100'
  },
  trophy: {
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    shadow: 'shadow-amber-100'
  }
};

export const AchievementUnlockAlert = ({ alert, onClose }: AchievementUnlockAlertProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = ALERT_COLORS[alert.type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
      <div
        className={cn(
          "relative p-4 rounded-lg border shadow-lg",
          "flex items-center gap-4",
          "transition-all duration-300 ease-in-out",
          "hover:scale-102 hover:shadow-xl",
          colors.bg,
          colors.border,
          colors.shadow
        )}
      >
        {/* Achievement Icon */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <img
            src={alert.achievement.visual_asset}
            alt={alert.achievement.title}
            className={cn(
              "w-10 h-10 object-contain",
              "transition-transform duration-300",
              "hover:scale-110"
            )}
          />
          <Confetti className="absolute inset-0" />
        </div>

        {/* Achievement Details */}
        <div className="flex-1">
          <h4 className={cn(
            "font-semibold mb-0.5",
            "animate-in fade-in slide-in-from-bottom-1",
            colors.text
          )}>
            Achievement Unlocked!
          </h4>
          <p className={cn(
            "text-sm text-muted-foreground",
            "animate-in fade-in slide-in-from-bottom-2"
          )}>
            {alert.achievement.title}
            {alert.tier && (
              <span className="ml-1 font-medium">({alert.tier.toUpperCase()})</span>
            )}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-2 right-2",
            "p-1 rounded-full",
            "text-gray-400 hover:text-gray-600",
            "transition-colors duration-200",
            "hover:bg-gray-100"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}; 