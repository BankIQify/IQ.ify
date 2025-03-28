
import { Lock as LockIcon, Unlock } from "lucide-react";

interface LockProps {
  lock: {
    id: string;
    x: number;
    y: number;
    isUnlocked: boolean;
    requiredKeyId: string;
  };
}

export const Lock = ({ lock }: LockProps) => {
  const lockSize = 36;
  const halfLockSize = lockSize / 2;

  return (
    <div
      className="absolute"
      style={{
        left: lock.x - halfLockSize,
        top: lock.y - halfLockSize,
        width: lockSize,
        height: lockSize,
        zIndex: 15,
      }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center shadow-md ${
          lock.isUnlocked ? 'bg-green-100' : 'bg-amber-100'
        }`}
      >
        {lock.isUnlocked ? (
          <Unlock className="h-5 w-5 text-green-600" />
        ) : (
          <LockIcon className="h-5 w-5 text-amber-600" />
        )}
      </div>
    </div>
  );
};
