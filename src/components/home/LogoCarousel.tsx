import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  description: string;
}

export const LogoCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();

  // Default companies with reliable logo URLs and descriptions
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
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Unilever_logo.svg",
      website_url: "https://unilever.com",
      description: "Adopts a skills-based approach, valuing creative problem-solving."
    },
    {
      id: "14",
      name: "Nike",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
      website_url: "https://nike.com",
      description: "Seeks innovative thinkers for product development."
    },
    {
      id: "15",
      name: "Procter & Gamble",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/PG_logo.svg",
      website_url: "https://pg.com",
      description: "Encourages strategic planning in consumer goods marketing."
    },
    {
      id: "16",
      name: "McKinsey & Company",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/McKinsey_%26_Company_logo.svg",
      website_url: "https://mckinsey.com",
      description: "Values strategic problem-solving in consulting."
    },
    {
      id: "17",
      name: "Deloitte",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Deloitte_logo.svg",
      website_url: "https://deloitte.com",
      description: "Emphasizes critical thinking in professional services."
    },
    {
      id: "18",
      name: "Accenture",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
      website_url: "https://accenture.com",
      description: "Seeks innovative solutions in technology consulting."
    },
    {
      id: "19",
      name: "3M",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/3M_logo.svg",
      website_url: "https://3m.com",
      description: "Encourages intrapreneurship and creative solutions."
    },
    {
      id: "20",
      name: "General Electric",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/General_Electric_logo.svg",
      website_url: "https://ge.com",
      description: "Values strategic innovation in engineering."
    },
    {
      id: "21",
      name: "Bosch",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Bosch_logo.svg",
      website_url: "https://bosch.com",
      description: "Focuses on problem-solving in manufacturing processes."
    },
    {
      id: "22",
      name: "Netflix",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      website_url: "https://netflix.com",
      description: "Seeks creative thinkers for content development."
    },
    {
      id: "23",
      name: "Disney",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
      website_url: "https://disney.com",
      description: "Encourages innovation in entertainment experiences."
    },
    {
      id: "24",
      name: "Spotify",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      website_url: "https://spotify.com",
      description: "Values strategic planning in music streaming services."
    }
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching companies:', error);
          setCompanies(defaultCompanies);
          return;
        }

        if (data && data.length > 0) {
          const typedData = data.map(item => ({
            id: String(item.id),
            name: String(item.name),
            logo_url: String(item.logo_url),
            website_url: String(item.website_url),
            description: String(item.description)
          }));
          setCompanies(typedData);
        } else {
          setCompanies(defaultCompanies);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load company logos');
        setCompanies(defaultCompanies);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    if (!isHovered && carouselRef.current) {
      let lastTime = performance.now();
      const scrollSpeed = 0.1; // Slowed down significantly

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        setScrollPosition((prev) => {
          const newPosition = prev + (scrollSpeed * deltaTime);
          const maxScroll = carouselRef.current!.scrollWidth - carouselRef.current!.clientWidth;
          
          if (newPosition >= maxScroll) {
            return 0;
          }
          return newPosition;
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isHovered]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2 tracking-tight">
            Used by future-focused professionals
          </h2>
          <h3 className="text-3xl font-sans font-medium text-gray-800 mb-2 tracking-wide">
            IQify is where strategic thinkers and problem solvers prepare to lead
          </h3>
          <p className="text-xl font-mono font-light text-gray-600 max-w-2xl mx-auto tracking-wider">
            just like some of our users hired by today's most innovative companies
          </p>
        </div>
        
        <div 
          ref={carouselRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex space-x-16"
            style={{ x: -scrollPosition }}
          >
            {companies.map((company) => (
              <motion.div
                key={company.id}
                className="flex-shrink-0 w-32 h-32 relative group"
                whileHover={{ scale: 1.1 }}
              >
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        console.error(`Failed to load logo for ${company.name}`);
                        e.currentTarget.src = "https://via.placeholder.com/128x128?text=" + company.name;
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <p className="text-white text-xs p-2 text-center">{company.description}</p>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LogoCarousel; 