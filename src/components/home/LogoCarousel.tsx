'use client';
import { useRef, useState, useEffect } from 'react';

const defaultCompanies = [
  {
    id: "1",
    name: "Google",
    logo_url: "/logos/google.svg",
    website_url: "https://google.com",
    description: "Encourages '20% time' for personal projects, fostering innovation."
  },
  {
    id: "2",
    name: "IBM",
    logo_url: "/logos/ibm.svg",
    website_url: "https://ibm.com",
    description: "Emphasizes design thinking and innovation in problem-solving."
  },
  {
    id: "3",
    name: "Salesforce",
    logo_url: "/logos/salesforce.svg",
    website_url: "https://salesforce.com",
    description: "Values creative solutions in customer relationship management."
  },
  {
    id: "4",
    name: "Goldman Sachs",
    logo_url: "/logos/goldman-sachs.svg",
    website_url: "https://goldmansachs.com",
    description: "Seeks analytical minds for strategic financial planning."
  },
  {
    id: "5",
    name: "Mastercard",
    logo_url: "/logos/mastercard.svg",
    website_url: "https://mastercard.com",
    description: "Focuses on innovative payment solutions requiring strategic foresight."
  },
  {
    id: "6",
    name: "Citigroup",
    logo_url: "/logos/citi.svg",
    website_url: "https://citigroup.com",
    description: "Encourages employees to think creatively in financial services."
  },
  {
    id: "7",
    name: "Johnson & Johnson",
    logo_url: "/logos/jnj.svg",
    website_url: "https://jnj.com",
    description: "Promotes innovation in healthcare solutions."
  },
  {
    id: "8",
    name: "Pfizer",
    logo_url: "/logos/pfizer.svg",
    website_url: "https://pfizer.com",
    description: "Values strategic planning in pharmaceutical development."
  },
  {
    id: "9",
    name: "Roche",
    logo_url: "/logos/roche.svg",
    website_url: "https://roche.com",
    description: "Encourages problem-solving in biotech research."
  },
  {
    id: "10",
    name: "Siemens Energy",
    logo_url: "/logos/siemens-energy.svg",
    website_url: "https://siemens-energy.com",
    description: "Actively seeks diverse perspectives for green energy solutions."
  },
  {
    id: "11",
    name: "Ørsted",
    logo_url: "/logos/orsted.svg",
    website_url: "https://orsted.com",
    description: "Focuses on innovative approaches to renewable energy."
  },
  {
    id: "12",
    name: "Enel",
    logo_url: "/logos/enel.svg",
    website_url: "https://enel.com",
    description: "Encourages strategic thinking in sustainable energy projects."
  },
  {
    id: "13",
    name: "Unilever",
    logo_url: "/logos/unilever.svg",
    website_url: "https://unilever.com",
    description: "Values creative problem-solving in consumer goods innovation."
  },
  {
    id: "14",
    name: "3M",
    logo_url: "/logos/3m.svg",
    website_url: "https://3m.com",
    description: "Innovation through collaboration and diversity."
  },
  {
    id: "15",
    name: "Adobe",
    logo_url: "/logos/adobe.svg",
    website_url: "https://adobe.com",
    description: "Creative solutions for digital experiences."
  },
  {
    id: "16",
    name: "Apple",
    logo_url: "/logos/apple.svg",
    website_url: "https://apple.com",
    description: "Innovation in technology and design."
  },
  {
    id: "17",
    name: "Disney",
    logo_url: "/logos/disney.svg",
    website_url: "https://disney.com",
    description: "Storytelling and creativity in entertainment."
  },
  {
    id: "18",
    name: "GE",
    logo_url: "/logos/ge.svg",
    website_url: "https://ge.com",
    description: "Innovation in industrial technology."
  },
  {
    id: "19",
    name: "LVMH",
    logo_url: "/logos/lvmh.svg",
    website_url: "https://lvmh.com",
    description: "Luxury and innovation in fashion and retail."
  },
  {
    id: "20",
    name: "Nike",
    logo_url: "/logos/nike.svg",
    website_url: "https://nike.com",
    description: "Innovation in sports and fitness."
  }
];

export default function LogoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

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
  const loopLogos = [...defaultCompanies, ...defaultCompanies, ...defaultCompanies];

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
              key={`${company.name}-${index}`}
              className="relative flex flex-col items-center w-32 shrink-0 group h-40"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Logo */}
              <img
                src={company.logo_url}
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