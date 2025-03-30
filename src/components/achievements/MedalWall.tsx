import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MedalWallProps {
  medals: Array<{
    id: string;
    name: string;
    description: string;
    tier: 'bronze' | 'silver' | 'gold';
    unlocked: boolean;
    progress?: {
      current: number;
      target: number;
    };
  }>;
}

const TIER_COLORS = {
  bronze: {
    bg: "from-orange-200 to-orange-300",
    border: "border-orange-400",
    text: "text-orange-900",
  },
  silver: {
    bg: "from-slate-200 to-slate-300",
    border: "border-slate-400",
    text: "text-slate-900",
  },
  gold: {
    bg: "from-yellow-200 to-yellow-300",
    border: "border-yellow-400",
    text: "text-yellow-900",
  },
};

export const MedalWall = ({ medals }: MedalWallProps) => {
  const [hoveredMedal, setHoveredMedal] = useState<string | null>(null);

  return (
    <Card className="card-iqify card-iqify-yellow">
      <CardHeader>
        <CardTitle className="text-xl text-iqify-navy flex items-center gap-2">
          <Medal className="h-5 w-5 text-iqify-yellow" />
          Medal Wall
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
          {medals.map((medal) => (
            <motion.div
              key={medal.id}
              className="relative"
              whileHover={{ scale: 1.05, y: -5 }}
              onHoverStart={() => setHoveredMedal(medal.id)}
              onHoverEnd={() => setHoveredMedal(null)}
            >
              <div
                className={cn(
                  "relative aspect-square rounded-full p-1",
                  "border-4 shadow-lg transform transition-all duration-300",
                  medal.unlocked ? TIER_COLORS[medal.tier].border : "border-gray-300",
                  medal.unlocked ? "rotate-0" : "rotate-12 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-full h-full rounded-full flex items-center justify-center",
                    "bg-gradient-to-br",
                    medal.unlocked ? TIER_COLORS[medal.tier].bg : "from-gray-200 to-gray-300"
                  )}
                >
                  <Medal
                    className={cn(
                      "w-8 h-8",
                      medal.unlocked ? TIER_COLORS[medal.tier].text : "text-gray-400"
                    )}
                  />
                </div>

                {/* Progress ring for locked medals */}
                {!medal.unlocked && medal.progress && (
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      className="text-gray-200"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-iqify-blue transition-all duration-300"
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="45"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - medal.progress.current / medal.progress.target)}`}
                    />
                  </svg>
                )}
              </div>

              {hoveredMedal === medal.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-10 w-48"
                >
                  <p className={cn(
                    "text-sm font-medium",
                    medal.unlocked ? TIER_COLORS[medal.tier].text : "text-gray-600"
                  )}>
                    {medal.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {medal.description}
                  </p>
                  {!medal.unlocked && medal.progress && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Progress: {medal.progress.current}/{medal.progress.target}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 