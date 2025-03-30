import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TrophyCabinetProps {
  trophies: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    unlocked: boolean;
    rarity: 'common' | 'rare' | 'legendary';
    progress?: {
      current: number;
      target: number;
    };
  }>;
}

const RARITY_STYLES = {
  common: {
    glow: "bg-blue-400/20",
    text: "text-blue-600",
    border: "border-blue-400",
  },
  rare: {
    glow: "bg-purple-400/20",
    text: "text-purple-600",
    border: "border-purple-400",
  },
  legendary: {
    glow: "bg-yellow-400/20",
    text: "text-yellow-600",
    border: "border-yellow-400",
  },
};

export const TrophyCabinet = ({ trophies }: TrophyCabinetProps) => {
  const [hoveredTrophy, setHoveredTrophy] = useState<string | null>(null);
  const [selectedTrophy, setSelectedTrophy] = useState<string | null>(null);

  return (
    <Card className="card-iqify card-iqify-green">
      <CardHeader>
        <CardTitle className="text-xl text-iqify-navy flex items-center gap-2">
          <Trophy className="h-5 w-5 text-iqify-green" />
          Trophy Cabinet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[400px] bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg p-8">
          {/* Glass cabinet effect */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-lg" />
          
          {/* Shelves */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
            {trophies.map((trophy, index) => (
              <motion.div
                key={trophy.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedTrophy(trophy.id)}
                onHoverStart={() => setHoveredTrophy(trophy.id)}
                onHoverEnd={() => setHoveredTrophy(null)}
              >
                <div
                  className={cn(
                    "relative aspect-square rounded-lg p-4",
                    "bg-white/80 shadow-lg cursor-pointer",
                    "transition-all duration-300 transform",
                    trophy.unlocked ? "hover:-translate-y-2" : "opacity-50 grayscale hover:-translate-y-1",
                    RARITY_STYLES[trophy.rarity].border
                  )}
                >
                  {/* Trophy image */}
                  <div className="relative w-full h-full">
                    <img
                      src={trophy.imageUrl}
                      alt={trophy.name}
                      className="w-full h-full object-contain"
                    />
                    
                    {/* Glow effect for unlocked trophies */}
                    {trophy.unlocked && (
                      <div className="absolute inset-0 -z-10 animate-pulse">
                        <div className={cn(
                          "absolute inset-0 rounded-full blur-2xl",
                          RARITY_STYLES[trophy.rarity].glow
                        )} />
                      </div>
                    )}
                  </div>

                  {/* Trophy info on hover */}
                  {hoveredTrophy === trophy.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-10 w-64"
                    >
                      <p className={cn(
                        "text-sm font-medium",
                        RARITY_STYLES[trophy.rarity].text
                      )}>
                        {trophy.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {trophy.description}
                      </p>
                      {!trophy.unlocked && trophy.progress && (
                        <div className="mt-2">
                          <div className="text-xs text-muted-foreground">
                            Progress: {trophy.progress.current}/{trophy.progress.target}
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full mt-1">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                RARITY_STYLES[trophy.rarity].text
                              )}
                              style={{
                                width: `${(trophy.progress.current / trophy.progress.target) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Shelf shadows */}
          <div className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-t from-gray-300/50 to-transparent" />
        </div>
      </CardContent>
    </Card>
  );
}; 