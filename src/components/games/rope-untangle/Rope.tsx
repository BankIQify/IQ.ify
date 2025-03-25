
import { useMemo } from "react";
import type { RopeSegment } from "./RopeUntangleBoard";

interface RopeProps {
  rope: RopeSegment;
}

export const Rope = ({ rope }: RopeProps) => {
  // Calculate the SVG path from the rope's points
  const pathData = useMemo(() => {
    if (rope.points.length < 2) return "";
    
    // For curved rope paths, we'll use bezier curves
    let path = `M ${rope.points[0].x} ${rope.points[0].y}`;
    
    // For each segment, create a smooth curve
    for (let i = 1; i < rope.points.length; i++) {
      const prev = rope.points[i - 1];
      const curr = rope.points[i];
      
      if (i === 1) {
        // First segment after starting point uses quadratic curve
        path += ` Q ${(prev.x + curr.x) / 2} ${(prev.y + curr.y) / 2}, ${curr.x} ${curr.y}`;
      } else {
        // Subsequent segments use cubic bezier curves for smoother connections
        const prevPrev = rope.points[i - 2];
        
        // Calculate control points for smooth curve
        const cp1x = prev.x + (prev.x - prevPrev.x) * 0.2;
        const cp1y = prev.y + (prev.y - prevPrev.y) * 0.2;
        
        const cp2x = curr.x - (curr.x - prev.x) * 0.2;
        const cp2y = curr.y - (curr.y - prev.y) * 0.2;
        
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  }, [rope.points]);

  // Create a double-lined rope for a more realistic rope appearance
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      {/* Rope shadow/outline */}
      <path
        d={pathData}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-opacity duration-300 ${
          rope.isUntangled ? "opacity-30" : "opacity-70"
        }`}
      />
      
      {/* Main rope line */}
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
      
      {/* Rope texture overlay pattern */}
      <path
        d={pathData}
        stroke="white"
        strokeWidth={2}
        strokeDasharray="3,12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-opacity duration-300 ${
          rope.isUntangled ? "opacity-30" : "opacity-50"
        }`}
      />
    </svg>
  );
};
