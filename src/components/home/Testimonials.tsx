import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
}

export const Testimonials = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pre-loaded testimonials for demonstration
  const preloadedTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Emily Thompson",
      role: "Year 6 Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      quote: "IQify has completely transformed my approach to learning. The personalised practice questions helped me improve my verbal reasoning scores dramatically. I'm now consistently at the top of my class!",
      rating: 5
    },
    {
      id: "2",
      name: "James Chen",
      role: "Secondary School Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      quote: "The brain training exercises are brilliant! They're challenging but fun, and I've noticed a real improvement in my problem-solving abilities. My teachers have noticed the difference too!",
      rating: 5
    },
    {
      id: "3",
      name: "Sophie Williams",
      role: "Grammar School Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      quote: "Thanks to IQify's non-verbal reasoning practice, I passed my grammar school entrance exam with flying colours. The interactive format made studying enjoyable rather than a chore.",
      rating: 5
    },
    {
      id: "4",
      name: "Alexander Kumar",
      role: "Year 5 Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander",
      quote: "I love how IQify adapts to my learning pace. The questions get more challenging as I improve, which keeps me motivated. It's like having a personal tutor available 24/7!",
      rating: 5
    },
    {
      id: "5",
      name: "Olivia Parker",
      role: "Independent School Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
      quote: "The variety of questions and puzzles keeps me engaged. I've seen a massive improvement in my cognitive skills, and my confidence has grown tremendously. Highly recommend!",
      rating: 5
    },
    {
      id: "6",
      name: "William Foster",
      role: "Year 7 Student",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
      quote: "IQify made preparing for my entrance exams so much easier. The practice questions are spot-on, and the explanations really help you understand where you went wrong. Brilliant platform!",
      rating: 5
    }
  ];

  const { data: testimonials = preloadedTestimonials } = useQuery({
    queryKey: ["approved-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, avatar_url, quote, rating")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data.length > 0 ? data : preloadedTestimonials;
    },
  });

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const handleAddTestimonial = () => {
    navigate("/testimonials/new");
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of satisfied learners and experience the difference for yourself.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4">
                    {testimonials[currentIndex].avatar_url ? (
                      <AvatarImage
                        src={testimonials[currentIndex].avatar_url}
                        alt={testimonials[currentIndex].name}
                      />
                    ) : (
                      <AvatarFallback>
                        {testimonials[currentIndex].name[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-lg italic text-muted-foreground">
                      "{testimonials[currentIndex].quote}"
                    </p>
                    <div>
                      <p className="font-semibold">{testimonials[currentIndex].name}</p>
                      {testimonials[currentIndex].role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

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
      </div>
    </section>
  );
}; 