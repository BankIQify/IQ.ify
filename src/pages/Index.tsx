import { Link } from "react-router-dom";
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target, Users, Clock, RefreshCw, Accessibility, Sparkles, Star, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AboutUs } from "@/components/home/AboutUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CustomAvatar } from "@/components/profile/avatar/CustomAvatar";
import { defaultConfig } from "@/components/profile/avatar/avatarConfig";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [homepageContent, setHomepageContent] = useState<any>(null);

  const { data: homepageContentData } = useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const features = [
    {
      icon: <Target className="w-8 h-8 text-pink-500" />,
      title: "Personalised Learning",
      description: "Areas of strengths and weakness are identified and development plans are created.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
      color: "pink"
    },
    {
      icon: <Brain className="w-8 h-8 text-green-500" />,
      title: "Expert-Led Questions",
      description: "Carefully crafted questions by educational experts to challenge and develop your skills.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
      color: "green"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-yellow-500" />,
      title: "Interactive Content",
      description: "Engaging exercises and activities that make learning enjoyable and effective.",
      image: "https://images.unsplash.com/photo-1665686306574-1ace09918530",
      color: "yellow"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-500" />,
      title: "Flexible Learning",
      description: "Learn at your own pace with on-demand access to course materials.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
      color: "blue"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Community Support",
      description: "Join a collaborative learning environment with peer-to-peer interaction.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80",
      color: "purple"
    },
  ];

  const differentiators = [
    {
      icon: <RefreshCw className="w-6 h-6 text-pink-500" />,
      title: "Continuous Updates",
      description: "Regularly updated content reflecting the latest educational trends.",
    },
    {
      icon: <Accessibility className="w-6 h-6 text-green-500" />,
      title: "Accessibility Features",
      description: "Inclusive design with subtitles, screen reader support, and adjustable text sizes.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-yellow-500" />,
      title: "Free Trial",
      description: "Experience our platform's offerings firsthand with a free trial period.",
    },
  ];

  const testimonials = homepageContentData?.testimonials || [
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(30,174,219,0.1)] to-[rgba(255,105,180,0.1)]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 relative min-h-[600px]">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Connecting the Cognitive Dots To A Boundless Mind
            </motion.h1>
            
            {/* Ratings and Stats */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-6 w-6 text-yellow-400 fill-current" 
                    strokeWidth={1}
                  />
                ))}
                <span className="ml-2 font-semibold text-gray-900">4.8/5 on App Store</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-semibold text-gray-900">over 5,000</span>
                  <span className="text-sm text-gray-600">Active Users</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <Trophy className="h-6 w-6 mb-2 text-primary" />
                  <span className="font-semibold text-gray-900">Best Cognitive</span>
                  <span className="text-sm text-gray-600">App 2023</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="font-semibold text-gray-900">Grounded in neuroscience. Powered by personalised learning insights</span>
              </div>
            </div>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Personalised learning experiences, expert-led questions, and interactive content to help you achieve your educational goals.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button size="lg">
                  {user ? "Go to Dashboard" : "Get Started"}
                </Button>
              </Link>
              <Link to="/practice">
                <Button size="lg" variant="outline">
                  Try Practice Questions
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div 
            className="relative h-full min-h-[400px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200" 
                alt="Student learning with headphones" 
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  console.error('Hero image failed to load');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUs />

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose iQify?</h2>
        <div className="space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg">{feature.description}</p>
                </div>
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-16 relative">
        {/* Pinboard background */}
        <div className="absolute inset-0 bg-[#f5f1e6] opacity-90" 
          style={{
            backgroundImage: `
              radial-gradient(#00000011 1px, transparent 1px),
              radial-gradient(#00000011 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px'
          }}
        />
        
        <div className="container mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-16">Differentiators</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((differentiator, index) => (
              <motion.div
                key={differentiator.title}
                className={`
                  p-6 rounded-sm shadow-lg transform rotate-${Math.floor(Math.random() * 3) - 1}
                  ${index === 0 ? 'bg-[#fff8b8]' : index === 1 ? 'bg-[#b8fff9]' : 'bg-[#ffb8ee]'}
                  hover:rotate-0 transition-transform duration-300
                  relative
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.1), -1px -1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {/* Fake pin */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 transform hover:scale-110 transition-transform">
                    {differentiator.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-handwriting">{differentiator.title}</h3>
                  <p className="text-gray-700 font-handwriting">{differentiator.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already improving their skills with iQify.
        </p>
        <Link to={user ? "/dashboard" : "/auth"}>
          <Button size="lg">
            {user ? "Continue Learning" : "Sign Up Now"}
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default Index;
