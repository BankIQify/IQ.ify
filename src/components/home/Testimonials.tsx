import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomAvatar } from '@/components/profile/avatar/CustomAvatar';
import { defaultConfig } from '@/components/profile/avatar/avatarConfig';

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  quote: string;
  avatar_component: React.ReactNode;
}

const preloadedTestimonials: Testimonial[] = [
  {
    name: "John Smith",
    role: "Student",
    rating: 5,
    quote: "IQify has transformed my learning experience. The personalised approach and interactive lessons have helped me grasp complex concepts with ease.",
    avatar_component: (
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
        <CustomAvatar
          config={defaultConfig}
          username="John Smith"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  },
  {
    name: "Sarah Johnson",
    role: "Parent",
    rating: 5,
    quote: "As a parent, I'm impressed by how engaging and effective IQify is. My child's academic performance has improved significantly.",
    avatar_component: (
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
        <CustomAvatar
          config={{...defaultConfig, gender: 'female'}}
          username="Sarah Johnson"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  },
  {
    name: "David Williams",
    role: "Teacher",
    rating: 5,
    quote: "IQify is an excellent tool that complements classroom teaching. It helps students learn at their own pace whilst maintaining high educational standards.",
    avatar_component: (
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
        <CustomAvatar
          config={defaultConfig}
          username="David Williams"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    )
  }
];

export const Testimonials = ({ testimonials = preloadedTestimonials }: { testimonials?: Testimonial[] }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + testimonials.length) % testimonials.length);
  };

  const handleAddTestimonial = () => {
    navigate("/testimonials/new");
  };

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-royal-blue to-bright-blue">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          What Our Users Say
        </h2>
        <div className="relative h-[400px]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    {testimonials[currentIndex].avatar_component}
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-gray-600">{testimonials[currentIndex].role}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    "{testimonials[currentIndex].quote}"
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={handleAddTestimonial}
            className="bg-primary hover:bg-primary/90"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Share Your Experience
          </Button>
        </div>
      </div>
    </section>
  );
}; 