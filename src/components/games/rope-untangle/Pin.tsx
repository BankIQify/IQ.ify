
import { Lock } from "lucide-react";

interface PinProps {
  pin: {
    id: string;
    x: number;
    y: number;
    color: string;
    isMovable: boolean;
    isMatched: boolean;
    requiredKeyId?: string;
  };
  onMouseDown: () => void;
  isDragging: boolean;
}

export const Pin = ({ pin, onMouseDown, isDragging }: PinProps) => {
  const pinSize = 28;
  const halfPinSize = pinSize / 2;

  return (
    <div
      className={`absolute cursor-grab select-none touch-none ${isDragging ? 'cursor-grabbing z-30' : 'z-20'} ${!pin.isMovable ? 'cursor-not-allowed' : ''}`}
      style={{
        left: pin.x - halfPinSize,
        top: pin.y - halfPinSize,
        width: pinSize,
        height: pinSize,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center shadow-md ${
          pin.isMatched ? 'ring-2 ring-green-400 ring-offset-2' : ''
        }`}
        style={{ backgroundColor: pin.color }}
      >
        {!pin.isMovable && pin.requiredKeyId && (
          <Lock className="h-3 w-3 text-white" />
        )}
      </div>
    </div>
  );
};
