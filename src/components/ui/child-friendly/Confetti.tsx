import { cn } from "@/lib/utils";

interface ConfettiProps {
  className?: string;
}

export const Confetti = ({ className }: ConfettiProps) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full",
            "animate-confetti",
            i % 3 === 0 && "bg-primary",
            i % 3 === 1 && "bg-accent",
            i % 3 === 2 && "bg-yellow-400",
            "opacity-90"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 500}ms`,
            transform: `scale(${0.8 + Math.random() * 0.4})`
          }}
        />
      ))}
    </div>
  );
}; 