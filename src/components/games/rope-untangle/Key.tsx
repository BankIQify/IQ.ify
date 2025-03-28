
import { Key as KeyIcon } from "lucide-react";

interface KeyProps {
  keyObj: {
    id: string;
    x: number;
    y: number;
    isCollected: boolean;
  };
}

export const Key = ({ keyObj }: KeyProps) => {
  if (keyObj.isCollected) return null;

  const keySize = 32;
  const halfKeySize = keySize / 2;

  return (
    <div
      className="absolute"
      style={{
        left: keyObj.x - halfKeySize,
        top: keyObj.y - halfKeySize,
        width: keySize,
        height: keySize,
        zIndex: 15,
      }}
    >
      <div className="w-full h-full rounded-full bg-yellow-100 flex items-center justify-center shadow-md animate-pulse">
        <KeyIcon className="h-5 w-5 text-yellow-600" />
      </div>
    </div>
  );
};
