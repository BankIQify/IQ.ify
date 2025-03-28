
interface PinHoleProps {
  hole: {
    id: string;
    x: number;
    y: number;
    color: string;
    isOccupied: boolean;
  };
}

export const PinHole = ({ hole }: PinHoleProps) => {
  const holeSize = 32;
  const halfHoleSize = holeSize / 2;

  return (
    <div
      className="absolute"
      style={{
        left: hole.x - halfHoleSize,
        top: hole.y - halfHoleSize,
        width: holeSize,
        height: holeSize,
        zIndex: 10,
      }}
    >
      <div
        className={`w-full h-full rounded-full border-2 ${
          hole.isOccupied ? 'border-green-400' : `border-${hole.color}`
        } bg-white/30 shadow-inner`}
        style={{ 
          borderColor: hole.color,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};
