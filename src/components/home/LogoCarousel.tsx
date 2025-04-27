'use client';
import { useRef, useState, useEffect } from 'react';

const defaultCompanies = [
  {
    id: "1",
    name: "Google",
    logo_url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    website_url: "https://google.com",
    description: "Encourages '20% time' for personal projects, fostering innovation."
  },
  {
    id: "2",
    name: "IBM",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
    website_url: "https://ibm.com",
    description: "Emphasizes design thinking and innovation in problem-solving."
  },
  {
    id: "3",
    name: "Salesforce",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce_logo.svg",
    website_url: "https://salesforce.com",
    description: "Values creative solutions in customer relationship management."
  },
  {
    id: "4",
    name: "Goldman Sachs",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Goldman_Sachs.svg",
    website_url: "https://goldmansachs.com",
    description: "Seeks analytical minds for strategic financial planning."
  },
  {
    id: "5",
    name: "Mastercard",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    website_url: "https://mastercard.com",
    description: "Focuses on innovative payment solutions requiring strategic foresight."
  },
  {
    id: "6",
    name: "Citigroup",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Citigroup.svg",
    website_url: "https://citigroup.com",
    description: "Encourages employees to think creatively in financial services."
  },
  {
    id: "7",
    name: "Johnson & Johnson",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Johnson_%26_Johnson_Logo.svg",
    website_url: "https://jnj.com",
    description: "Promotes innovation in healthcare solutions."
  },
  {
    id: "8",
    name: "Pfizer",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Pfizer_logo.svg",
    website_url: "https://pfizer.com",
    description: "Values strategic planning in pharmaceutical development."
  },
  {
    id: "9",
    name: "Roche",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Roche_logo.svg",
    website_url: "https://roche.com",
    description: "Encourages problem-solving in biotech research."
  },
  {
    id: "10",
    name: "Siemens Energy",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Siemens_Energy_logo.svg",
    website_url: "https://siemens-energy.com",
    description: "Actively seeks diverse perspectives for green energy solutions."
  },
  {
    id: "11",
    name: "Ørsted",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/%C3%98rsted_logo.svg",
    website_url: "https://orsted.com",
    description: "Focuses on innovative approaches to renewable energy."
  },
  {
    id: "12",
    name: "Enel",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Enel_logo.svg",
    website_url: "https://enel.com",
    description: "Encourages strategic thinking in sustainable energy projects."
  },
  {
    id: "13",
    name: "Unilever",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Unilever_logo.svg",
    website_url: "https://unilever.com",
    description: "Values creative problem-solving in consumer goods innovation."
  },
  {
    id: "14",
    name: "Microsoft",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_logo.svg",
    website_url: "https://microsoft.com",
    description: "Promotes innovation through its 'Hackathon' culture."
  },
  {
    id: "15",
    name: "Amazon",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website_url: "https://amazon.com",
    description: "Values creative solutions in e-commerce and cloud computing."
  },
  {
    id: "16",
    name: "Apple",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    website_url: "https://apple.com",
    description: "Encourages design thinking in product development."
  },
  {
    id: "17",
    name: "Facebook",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    website_url: "https://facebook.com",
    description: "Values innovation in social media and technology."
  },
  {
    id: "18",
    name: "Tesla",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Tesla_logo.svg",
    website_url: "https://tesla.com",
    description: "Focuses on innovative approaches to sustainable energy."
  },
  {
    id: "19",
    name: "Netflix",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    website_url: "https://netflix.com",
    description: "Values creative content and streaming solutions."
  },
  {
    id: "20",
    name: "Spotify",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    website_url: "https://spotify.com",
    description: "Encourages innovation in music streaming technology."
  }
];

const companies = defaultCompanies.map(company => ({
  name: company.name,
  slug: company.name.toLowerCase().replace(' ', '-'),
  description: company.description
}));

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