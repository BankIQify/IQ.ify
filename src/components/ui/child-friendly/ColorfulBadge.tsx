
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
  blue: "bg-[rgba(30,174,219,0.2)] text-[#1EAEDB] border-[rgba(30,174,219,0.4)]",
  green: "bg-[rgba(0,255,127,0.2)] text-[rgba(0,255,127,0.9)] border-[rgba(0,255,127,0.4)]",
  purple: "bg-purple-100 text-purple-600 border-purple-200",
  amber: "bg-amber-100 text-amber-600 border-amber-200",
  pink: "bg-[rgba(255,105,180,0.2)] text-[#FF69B4] border-[rgba(255,105,180,0.4)]",
  teal: "bg-teal-100 text-teal-600 border-teal-200",
  orange: "bg-[rgba(255,127,0,0.2)] text-[#FF7F00] border-[rgba(255,127,0,0.4)]",
  yellow: "bg-[rgba(255,215,0,0.2)] text-[rgba(255,215,0,0.9)] border-[rgba(255,215,0,0.4)]",
};

const sizeVariants = {
  sm: "p-3 text-xs",
  md: "p-4 text-sm",
  lg: "p-5 text-base",
};

const iconSizeVariants = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-9 w-9",
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
        "flex flex-col items-center rounded-xl border-2 transition-all shadow-md",
        colorVariants[color],
        sizeVariants[size],
        !earned && "opacity-50 grayscale",
        earned && "animate-float"
      )}
    >
      <div className="mb-2 bg-white/50 p-2 rounded-full">
        <Icon className={cn(iconSizeVariants[size], earned && "animate-pulse")} />
      </div>
      <span className="font-bold text-center">{label}</span>
    </div>
  );
};
