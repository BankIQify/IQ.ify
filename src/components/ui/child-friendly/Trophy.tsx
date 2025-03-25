
import { Trophy as TrophyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrophyProps {
  label: string;
  value: string | number;
  description?: string;
  color: "gold" | "silver" | "bronze" | "blue" | "green" | "purple" | "pink" | "orange";
  size?: "sm" | "md" | "lg";
}

const colorVariants = {
  gold: "bg-gradient-to-b from-amber-300 to-yellow-500 text-amber-900 border-amber-400",
  silver: "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800 border-gray-400",
  bronze: "bg-gradient-to-b from-amber-600 to-amber-700 text-amber-100 border-amber-500",
  blue: "bg-gradient-to-b from-iqify-blue to-blue-600 text-blue-50 border-blue-400",
  green: "bg-gradient-to-b from-iqify-green to-green-500 text-green-900 border-green-400",
  purple: "bg-gradient-to-b from-purple-400 to-purple-600 text-purple-50 border-purple-400",
  pink: "bg-gradient-to-b from-iqify-pink to-pink-600 text-pink-50 border-pink-400",
  orange: "bg-gradient-to-b from-iqify-orange to-orange-600 text-orange-50 border-orange-400",
};

const sizeVariants = {
  sm: "p-3 text-xs",
  md: "p-4 text-sm",
  lg: "p-5 text-base",
};

const iconSizeVariants = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export const Trophy = ({
  label,
  value,
  description,
  color = "gold",
  size = "md",
}: TrophyProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center rounded-xl shadow-lg border-2",
        colorVariants[color],
        sizeVariants[size],
        "transform transition-transform hover:scale-105 animate-float"
      )}
    >
      <div className="p-2 rounded-full bg-white/30 mb-2 shadow-inner">
        <TrophyIcon className={cn(iconSizeVariants[size])} />
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="font-medium">{label}</div>
      {description && (
        <div className="text-xs mt-1 opacity-90">{description}</div>
      )}
    </div>
  );
};
