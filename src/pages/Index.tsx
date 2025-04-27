import { Link } from "react-router-dom";
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target, Users, Clock, RefreshCw, Accessibility, Sparkles, Star, MessageSquare, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { AboutIQify } from "@/components/home/AboutIQify";
import { WhyChooseCards } from "@/components/home/WhyChooseCards";
import { Testimonials } from "@/components/home/Testimonials";
import { CustomAvatar } from "@/components/profile/avatar/CustomAvatar";
import { defaultConfig } from "@/components/profile/avatar/avatarConfig";
import { useAuth } from "@/contexts/AuthContext";
import LogoCarousel from "@/components/home/LogoCarousel";
import { Icon } from "@/components/ui/icon";

interface Feature {
  id: string;
  title: string;
  description: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  media_path: string | null;
  order_index: number;
}

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video' | null;
  media_alt_text?: string;
  order_index: number;
}

interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  media_alt_text?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const POST_IT_COLORS = [
  { value: "yellow", color: "#fff8b8" },
  { value: "blue", color: "#b8fff9" },
  { value: "pink", color: "#ffb8ee" },
];

const AVAILABLE_ICONS = [
  'lightbulb',
  'rocket',
  'star',
  'heart',
  'shield',
  'trophy',
  'award',
  'gem',
  'crown',
  'sparkles'
];

const Index = () => {
  const { user } = useAuth();
  const { isAdmin } = useAuth();

  const { data: features = [], error: featuresError } = useQuery({
    queryKey: ["features"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("features")
          .select("*")
          .order("order_index");
        
        if (error) {
          console.error("Error fetching features:", error);
          return [];
        }
        
        if (!data || data.length === 0) {
          return [];
        }

        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          media_url: item.media_url,
          media_type: item.media_type,
          media_path: item.media_path,
          order_index: item.order_index
        })) as Feature[];
      } catch (err) {
        console.error("Unexpected error fetching features:", err);
        return [];
      }
    },
  });

  // Temporary features data
  const tempFeatures = [
    {
      id: "temp-1",
      title: "Personalised Learning Paths",
      description: "Our AI-powered system creates custom learning paths based on your strengths, weaknesses, and learning style.",
      media_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      media_type: "image",
      media_path: null,
      order_index: 0
    },
    {
      id: "temp-2",
      title: "Interactive Practice Questions",
      description: "Engage with our extensive library of interactive questions that adapt to your performance level.",
      media_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      media_type: "image",
      media_path: null,
      order_index: 1
    },
    {
      id: "temp-3",
      title: "Real-time Progress Tracking",
      description: "Monitor your progress with detailed analytics and insights to help you stay on track.",
      media_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
      media_type: "image",
      media_path: null,
      order_index: 2
    }
  ];

  // Combine database features with temporary features
  const allFeatures = [...features, ...tempFeatures];

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

  const { data: differentiators = [], isLoading: isLoadingDifferentiators } = useQuery({
    queryKey: ["differentiators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("differentiators")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        icon: item.icon,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })) as Differentiator[];
    },
  });

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

  const { data: whyChooseData = [] } = useQuery({
    queryKey: ["why-choose-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('why_choose_cards')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      
      // Ensure type safety by mapping the data
      return (data || []).map(item => {
        // Ensure the media_url is properly formatted
        let mediaUrl = item.media_url as string | null;
        if (mediaUrl && !mediaUrl.startsWith('http')) {
          // If it's a storage path, get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('why-choose-iqify-media')
            .getPublicUrl(mediaUrl);
          mediaUrl = publicUrl;
        }

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          media_url: mediaUrl || '',
          media_type: item.media_type as 'image' | 'video' | null,
          media_alt_text: item.media_alt_text || '',
          order_index: item.order_index
        };
      }) as WhyChooseCard[];
    }
  });

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

      {/* About IQify Section */}
      <section className="container mx-auto px-4 py-16">
        <AboutIQify />
      </section>

      {/* Why Choose IQify Section */}
      <section className="container mx-auto px-4 py-16">
        <WhyChooseCards />
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
            {differentiators?.map((differentiator, index) => (
              <motion.div
                key={differentiator.id}
                className={`
                  p-6 rounded-sm shadow-lg transform rotate-${Math.floor(Math.random() * 3) - 1}
                  hover:rotate-0 transition-transform duration-300
                  relative
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{
                  boxShadow: '2px 2px 5px rgba(0,0,0,0.1), -1px -1px 2px rgba(0,0,0,0.05)',
                  backgroundColor: POST_IT_COLORS.find(c => c.value === differentiator.color)?.color || '#fff8b8'
                }}
              >
                {/* Fake pin */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 transform hover:scale-110 transition-transform">
                    {AVAILABLE_ICONS.includes(differentiator.icon) ? (
                      <Icon name={differentiator.icon} className="w-6 h-6" />
                    ) : (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-handwriting">{differentiator.title}</h3>
                  <p className="text-gray-700 font-handwriting mb-4">{differentiator.description}</p>
                  {differentiator.media_url && (
                    <div className="w-full aspect-video rounded-md overflow-hidden">
                      {differentiator.media_type === 'video' ? (
                        <video
                          src={differentiator.media_url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={differentiator.media_url}
                          alt={differentiator.media_alt_text || differentiator.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Carousel Section */}
      <section className="py-12 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <LogoCarousel />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of students who are already improving their skills with IQify.
        </p>
        <div className="flex justify-center">
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg">
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
