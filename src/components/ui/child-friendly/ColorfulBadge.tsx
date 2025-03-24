
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorfulBadgeProps {
  icon: LucideIcon;
  label: string;
  color: "blue" | "green" | "purple" | "amber" | "pink" | "teal" | "orange" | "yellow";
  size?: "sm" | "md" | "lg";
  earned?: boolean;
}

const colorVariants = {
  blue: "bg-iqify-blue/20 text-iqify-blue border-iqify-blue/40",
  green: "bg-iqify-green/20 text-iqify-green/90 border-iqify-green/40",
  purple: "bg-purple-100 text-purple-600 border-purple-200",
  amber: "bg-amber-100 text-amber-600 border-amber-200",
  pink: "bg-iqify-pink/20 text-iqify-pink border-iqify-pink/40",
  teal: "bg-teal-100 text-teal-600 border-teal-200",
  orange: "bg-iqify-orange/20 text-iqify-orange border-iqify-orange/40",
  yellow: "bg-iqify-yellow/20 text-iqify-yellow/90 border-iqify-yellow/40",
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
        !earned && "opacity-50 grayscale",
        earned && "animate-float"
      )}
    >
      <div className="mb-2">
        <Icon className={cn(iconSizeVariants[size], earned && "animate-pulse")} />
      </div>
      <span className="font-medium text-center">{label}</span>
    </div>
  );
};
