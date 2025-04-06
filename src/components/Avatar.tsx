import { cn } from "@/lib/utils";

interface AvatarProps {
  seed?: string;
  className?: string;
}

export function Avatar({ seed = "default", className }: AvatarProps) {
  return (
    <img
      src={`/api/avatar?seed=${encodeURIComponent(seed)}`}
      alt="Avatar"
      className={cn("rounded-full", className)}
      onError={(e) => {
        // Fallback to a default avatar if loading fails
        e.currentTarget.src = "/default-avatar.svg";
      }}
    />
  );
} 