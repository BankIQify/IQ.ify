
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorfulBadgeProps {
  icon: LucideIcon;
  label: string;
  color: "blue" | "green" | "purple" | "amber" | "pink" | "teal";
  size?: "sm" | "md" | "lg";
  earned?: boolean;
}

const colorVariants = {
  blue: "bg-blue-100 text-blue-600 border-blue-200",
  green: "bg-green-100 text-green-600 border-green-200",
  purple: "bg-purple-100 text-purple-600 border-purple-200",
  amber: "bg-amber-100 text-amber-600 border-amber-200",
  pink: "bg-pink-100 text-pink-600 border-pink-200",
  teal: "bg-teal-100 text-teal-600 border-teal-200",
};

const sizeVariants = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
};

const iconSizeVariants = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const ColorfulBadge = ({
  icon: Icon,
  label,
  color = "blue",
  size = "md",
  earned = true,
}: ColorfulBadgeProps) => {
  return (
    <div 
      className={cn(
        "flex flex-col items-center rounded-lg border-2 transition-all",
        colorVariants[color],
        sizeVariants[size],
        !earned && "opacity-50 grayscale"
      )}
    >
      <div className="mb-2">
        <Icon className={cn(iconSizeVariants[size], "animate-pulse")} />
      </div>
      <span className="font-medium text-center">{label}</span>
    </div>
  );
};
