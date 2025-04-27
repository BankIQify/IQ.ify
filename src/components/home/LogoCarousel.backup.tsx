'use client';
import { useRef, useState, useEffect } from 'react';

const companies = [
  { name: "Google", slug: "google", description: "Encourages '20% time' for personal projects, fostering innovation." },
  { name: "IBM", slug: "ibm", description: "Emphasizes design thinking and innovation in problem-solving." },
  { name: "Salesforce", slug: "salesforce", description: "Values creative solutions in customer relationship management." },
  { name: "Goldman Sachs", slug: "goldman-sachs", description: "Seeks analytical minds for strategic financial planning." },
  { name: "Mastercard", slug: "mastercard", description: "Focuses on innovative payment solutions requiring strategic foresight." },
  { name: "Citi", slug: "citi", description: "Encourages employees to think creatively in financial services." },
  { name: "Johnson & Johnson", slug: "jnj", description: "Promotes innovation in healthcare solutions." },
  { name: "Pfizer", slug: "pfizer", description: "Values strategic planning in pharmaceutical development." },
  { name: "Roche", slug: "roche", description: "Encourages problem-solving in biotech research." },
  { name: "Siemens Energy", slug: "siemens-energy", description: "Actively seeks diverse perspectives for green energy solutions." },
  { name: "Ørsted", slug: "orsted", description: "Focuses on innovative approaches to renewable energy." },
  { name: "Enel", slug: "enel", description: "Encourages strategic thinking in sustainable energy projects." },
  { name: "Unilever", slug: "unilever", description: "Adopts a skills-based approach, valuing creative problem-solving." },
  { name: "Nike", slug: "nike", description: "Seeks innovative solutions in sports and apparel design." },
  { name: "Adobe", slug: "adobe", description: "Champions creativity and innovation in digital experiences." },
  { name: "LVMH", slug: "lvmh", description: "Values strategic foresight in luxury brand management." },
  { name: "Disney", slug: "disney", description: "Encourages imaginative storytelling and innovative entertainment." },
  { name: "Apple", slug: "apple", description: "Leads in technology innovation and user experience design." },
  { name: "3M", slug: "3m", description: "Encourages intrapreneurship and creative solutions." },
  { name: "General Electric", slug: "ge", description: "Focuses on strategic planning in industrial solutions." },
];

export default function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Scroll logic for infinite loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;

    const scroll = () => {
      // Smooth scroll by 1 pixel
      track.scrollLeft += 1.2;
      
      // When we reach the end, reset to start
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth) {
        track.scrollLeft = 0;
      }
      


      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Create infinite loop by duplicating logos
  const loopLogos = [...companies, ...companies, ...companies];

  return (
    <div className="w-full bg-white py-12 relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Used by future-focused professionals</h2>
        <p className="text-gray-600 text-lg mt-2">IQify is where strategic thinkers and problem solvers prepare to lead</p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <div ref={trackRef} className="flex whitespace-nowrap space-x-12" style={{ height: '160px', overflow: 'hidden' }}>
          {loopLogos.map((company, index) => (
            <div
              key={`${company.slug}-${index}`}
              className="relative flex flex-col items-center w-32 shrink-0 group h-40"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              ref={logoRef}
            >
              {/* Logo */}
              <img
                src={`/logos/${company.slug}.svg`}
                alt={company.name}
                className="w-20 h-20 object-contain grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = '/logos/default-logo.svg';
                }}
              />

              {/* Company Name */}
              <p className="mt-2 text-sm text-gray-700 font-medium text-center">{company.name}</p>
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-base font-medium shadow-xl p-4 rounded-xl max-w-md w-96 transition-all duration-200 border border-blue-500"
            style={{
              position: 'absolute',
              top: 180,
              left: '50%',
              zIndex: 1000,
              pointerEvents: 'none',
              transform: 'translateX(-50%)',
              transformOrigin: 'center top',
              opacity: 0.95,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            {loopLogos[hoveredIndex].description}
          </div>
        )}
      </div>
    </div>
  );
}