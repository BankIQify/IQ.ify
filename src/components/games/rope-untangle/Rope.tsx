
import { useMemo } from "react";
import type { RopeSegment } from "./RopeUntangleBoard";

interface RopeProps {
  rope: RopeSegment;
}

export const Rope = ({ rope }: RopeProps) => {
  // Calculate the SVG path from the rope's points
  const pathData = useMemo(() => {
    if (rope.points.length < 2) return "";
    
    // Start at the first point
    let path = `M ${rope.points[0].x} ${rope.points[0].y}`;
    
    // For each subsequent point, draw a curve
    for (let i = 1; i < rope.points.length; i++) {
      const prev = rope.points[i - 1];
      const curr = rope.points[i];
      
      // Simple line for now, but could be enhanced to bezier curves for smoother ropes
      path += ` L ${curr.x} ${curr.y}`;
    }
    
    return path;
  }, [rope.points]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <path
        d={pathData}
        stroke={rope.color}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-opacity duration-300 ${
          rope.isUntangled ? "opacity-50" : "opacity-100"
        }`}
      />
    </svg>
  );
};
