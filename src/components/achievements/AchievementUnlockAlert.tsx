import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import type { AchievementUnlockAlert as AlertType } from '@/types/achievements/types';
import { AnimatedAchievement } from './AnimatedAchievement';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementUnlockAlertProps {
  alert: AlertType;
  onClose: () => void;
  className?: string;
}

export const AchievementUnlockAlert = ({ alert, onClose, className }: AchievementUnlockAlertProps) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={cn('fixed top-4 right-4 z-50', className)}
      >
        <Card className="w-[350px] overflow-hidden bg-gradient-to-br from-iqify-blue/10 to-iqify-blue/30 border-iqify-blue/20">
          <div className="p-6">
            <div className="flex items-start gap-4">
              {/* Achievement Icon */}
              <div className="relative flex-shrink-0 w-16 h-16">
                <AnimatedAchievement
                  src={alert.achievement.visual_asset}
                  alt={alert.achievement.title}
                  className="w-full h-full"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-iqify-green flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Achievement Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-iqify-green">
                    Achievement Unlocked!
                  </div>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ×
                  </button>
                </div>
                <h3 className="text-lg font-semibold mt-1">
                  {alert.achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {alert.achievement.description}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}; 