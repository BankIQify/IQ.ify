import { Target, Brain, BookOpen, Gauge, Lightbulb, TrendingUp, Zap } from "lucide-react";

export const iconMap = {
  target: Target,
  brain: Brain,
  book: BookOpen,
  gauge: Gauge,
  lightbulb: Lightbulb,
  trending: TrendingUp,
  zap: Zap,
} as const;

export type IconType = keyof typeof iconMap;

export interface SubtopicPerformance {
  id: string;
  name: string;
  score: number;
  lastTested: string;
  improvement: string;
  icon: IconType;
} 