import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface StatCard {
  id: string;
  highlight: string;
  supportingText: string;
}

const defaultStats: StatCard[] = [
  {
    id: "1",
    highlight: "Many IQify students have achieved 100% GCSE scores",
    supportingText: "Our students across Britain and China consistently reach top academic results using our platform."
  },
  {
    id: "2",
    highlight: "Selective school graduates are 40% more likely to secure high-paying jobs",
    supportingText: "Cognitive training and critical thinking significantly improve future academic and career outcomes."
  },
  {
    id: "3",
    highlight: "Companies like Google and Apple prioritise cognitive skills, rating them 70% more important than basic memorisation",
    supportingText: "IQify provides accessible cognitive training, equipping learners with essential skills sought by industry leaders."
  },
  {
    id: "4",
    highlight: "Firms prioritising cognitive skills are 50% more innovative and profitable",
    supportingText: "Major global employers actively seek creativity and cognitive agility, directly impacting business success."
  },
  {
    id: "5",
    highlight: "Students engaging in regular cognitive training outperform peers by up to 35%",
    supportingText: "IQify develops strategic thinking and adaptability, bridging the gap between potential and real-world performance."
  }
];

const cardStyles = [
  {
    background: "bg-pink-50",
    highlight: "text-pink-500",
    supporting: "text-pink-700"
  },
  {
    background: "bg-blue-50",
    highlight: "text-blue-500",
    supporting: "text-blue-700"
  },
  {
    background: "bg-green-50",
    highlight: "text-green-500",
    supporting: "text-green-700"
  },
  {
    background: "bg-purple-50",
    highlight: "text-purple-500",
    supporting: "text-purple-700"
  },
  {
    background: "bg-yellow-50",
    highlight: "text-yellow-500",
    supporting: "text-yellow-700"
  }
];

export const AboutUs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stats, setStats] = useState<StatCard[]>(defaultStats);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate cards every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === 0 ? stats.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === stats.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + stats.length) % stats.length;
      visibleCards.push(stats[index]);
    }
    return visibleCards;
  };

  return (
    <div className="w-full bg-[rgba(30,174,219,0.1)] py-20">
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">About IQify</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              IQify is dedicated to unlocking your full cognitive potential through scientifically-proven methods. 
              Our global approach has empowered students in Britain and China to achieve exceptional academic success. 
              Explore how our approach can bridge the gap between potential and achievement.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Right Column - Interactive Cards */}
          <div className="lg:col-span-8 relative w-full overflow-hidden">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <AnimatePresence mode="wait">
                <div className="absolute inset-0 flex items-center justify-center">
                  {getVisibleCards().map((card, index) => {
                    const isCenter = index === 1;
                    const isLeft = index === 0;
                    const isRight = index === 2;
                    const styleIndex = (currentIndex + index + stats.length) % stats.length;

                    const getAnimationProps = () => {
                      if (isMobile) {
                        return {
                          x: '-50%',
                          y: isLeft ? '100%' : isRight ? '-100%' : 0
                        };
                      }
                      return {
                        y: 0,
                        x: isLeft ? '-120%' : isRight ? '120%' : '-50%'
                      };
                    };

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ 
                          scale: isCenter ? 1 : 0.8,
                          opacity: isCenter ? 1 : 0.5,
                          ...getAnimationProps()
                        }}
                        animate={{ 
                          scale: isCenter ? 1 : 0.8,
                          opacity: isCenter ? 1 : 0.5,
                          ...getAnimationProps()
                        }}
                        exit={{ 
                          scale: 0.8,
                          opacity: 0.5,
                          ...getAnimationProps()
                        }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "absolute transition-all duration-300",
                          isCenter ? "z-20" : "z-10",
                          "left-1/2"
                        )}
                      >
                        <Card className={cn(
                          "w-[280px] sm:w-[350px] md:w-[450px]",
                          "h-[250px] sm:h-[300px] md:h-[400px]",
                          "transition-all duration-300",
                          cardStyles[styleIndex].background,
                          "shadow-lg"
                        )}>
                          <CardContent className="p-6 h-full flex flex-col justify-center">
                            <h3 className={cn(
                              "text-xl md:text-2xl font-bold mb-4",
                              cardStyles[styleIndex].highlight
                            )}>
                              {card.highlight}
                            </h3>
                            <p className={cn(
                              "text-sm md:text-base",
                              cardStyles[styleIndex].supporting
                            )}>
                              {card.supportingText}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute inset-x-0 bottom-2 md:bottom-4 flex justify-center space-x-4 z-30">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="rounded-full bg-white/80 backdrop-blur-sm h-8 w-8 md:h-10 md:w-10"
                  disabled={isAnimating}
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="rounded-full bg-white/80 backdrop-blur-sm h-8 w-8 md:h-10 md:w-10"
                  disabled={isAnimating}
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs; 