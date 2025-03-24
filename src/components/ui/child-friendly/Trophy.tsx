
import { Trophy as TrophyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrophyProps {
  label: string;
  value: string | number;
  description?: string;
  color: "gold" | "silver" | "bronze" | "blue" | "green" | "purple";
  size?: "sm" | "md" | "lg";
}

const colorVariants = {
  gold: "bg-gradient-to-b from-amber-300 to-yellow-500 text-amber-900",
  silver: "bg-gradient-to-b from-gray-300 to-gray-400 text-gray-800",
  bronze: "bg-gradient-to-b from-amber-600 to-amber-700 text-amber-100",
  blue: "bg-gradient-to-b from-blue-400 to-blue-600 text-blue-50",
  green: "bg-gradient-to-b from-green-400 to-green-600 text-green-50",
  purple: "bg-gradient-to-b from-purple-400 to-purple-600 text-purple-50",
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
        "flex flex-col items-center rounded-lg shadow-lg",
        colorVariants[color],
        sizeVariants[size],
        "transform transition-transform hover:scale-105"
      )}
    >
      <div className="p-2 rounded-full bg-white/20 mb-2">
        <TrophyIcon className={cn(iconSizeVariants[size])} />
      </div>
      <div className="text-xl font-bold">{value}</div>
      <div className="font-medium">{label}</div>
      {description && (
        <div className="text-xs mt-1 opacity-80">{description}</div>
      )}
    </div>
  );
};
