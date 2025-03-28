import { Link } from "react-router-dom";
<<<<<<< HEAD
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target, Users, Clock, RefreshCw, Accessibility, Sparkles, Star, MessageSquare, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const Index = () => {
  const { user } = useAuthContext();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const { data: homepageContent } = useQuery({
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

  const testimonials = homepageContent?.testimonials || [
    {
      name: "Sarah Thompson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      quote: "The personalised learning approach helped me identify my weak areas and improve significantly. I went from struggling with verbal reasoning to scoring in the top 10% of my year group!"
    },
    {
      name: "James Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      rating: 5,
      quote: "The interactive content made learning fun and engaging. I actually looked forward to practising! The brain training games were particularly helpful for improving my problem-solving skills."
    },
    {
      name: "Emma Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      rating: 5,
      quote: "The community support was amazing. I learned so much from discussing with other students. The platform helped me build confidence and develop a growth mindset."
    },
    {
      name: "Oliver Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
      rating: 5,
      quote: "The expert-led questions were challenging but rewarding. I appreciated how each question helped me understand the underlying concepts, not just memorise answers."
    },
    {
      name: "Sophie Anderson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      rating: 5,
      quote: "The flexible learning schedule was perfect for me. I could practice whenever I wanted, and the progress tracking helped me stay motivated. Highly recommend!"
    },
    {
      name: "Lucas Rodriguez",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      rating: 5,
      quote: "The platform's accessibility features made it easy for me to use with my learning differences. The support team was always helpful when I needed assistance."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-white to-blue-50/50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>
        <div className="container mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 font-display">
                {homepageContent?.hero_title || "Master the 11+ Exam"}
              </h1>
              <p className="text-xl text-slate-600 mb-8 font-body">
                {homepageContent?.hero_subtitle || "Comprehensive preparation for verbal and non-verbal reasoning with interactive practice and brain training."}
              </p>
              <div className="space-y-4">
                {user ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/lets-practice">
                      <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                        Start Practising
                      </Button>
                    </Link>
                    <Link to="/brain-training">
                      <Button size="lg" variant="outline" className="border-2 border-slate-200 text-slate-800 hover:bg-slate-50 px-8 py-6 text-lg rounded-full">
                        Play Brain Games
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
              <div className="mt-8 text-slate-600 flex flex-wrap gap-6">
                <span className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    <Star className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    <Star className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    <Star className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    <Star className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    <span className="text-sm ml-2 text-slate-700">4.8</span>
                  </div>
                </span>
                <span className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Users className="w-5 h-5 text-green-500 mr-2" />
                  Trusted by over 8,000+ students
                </span>
                <span className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <Brain className="w-5 h-5 text-blue-500 mr-2" />
                  Built on cognitive science and informed by research-based methods proven to improve retention and reasoning
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[600px] rounded-[2rem] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1610484826967-09c5720778c7"
                  alt="Young student in red hoodie wearing headphones, focused on learning with his laptop"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-display">Why Choose Us</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-body">
              Our platform combines cutting-edge technology with proven educational methods to help you succeed
            </p>
          </div>
          <div className="space-y-32">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  index % 2 === 0 
                    ? "lg:ml-0" 
                    : "lg:ml-16"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={`space-y-6 ${
                    index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                  }`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-${feature.color}-100`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-800 font-display">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-lg font-body">
                      {feature.description}
                    </p>
                  </div>
                  <div className={`relative ${
                    index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                  }`}>
                    <div className="relative w-full h-[400px] rounded-[2rem] overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-${feature.color}-100 rounded-full mix-blend-multiply filter blur-xl opacity-70`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-display">What Our Students Say</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-body">
              Join thousands of students who have improved their skills with our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index >= currentTestimonialIndex && index < currentTestimonialIndex + 3 ? 1 : 0,
                  x: index >= currentTestimonialIndex && index < currentTestimonialIndex + 3 ? 0 : 100
                }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                  index >= currentTestimonialIndex && index < currentTestimonialIndex + 3 ? 'block' : 'hidden'
                }`}
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-100 rounded-full mix-blend-multiply filter blur-sm opacity-70" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-100 rounded-full mix-blend-multiply filter blur-sm opacity-70" />
                <div className="flex flex-col">
                  <div className="flex items-center mb-6">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-slate-800 font-display">{testimonial.name}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-8 h-8 fill-[#FFD700] text-[#FFD700]" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic font-body">"{testimonial.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
          {user && (
            <div className="text-center mt-12">
              <Link to="/profile">
                <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Write a Testimonial
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-display">What Sets Us Apart</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-body">
              Our commitment to excellence and innovation makes us the preferred choice for students
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-pink-100 rounded-full mix-blend-multiply filter blur-sm opacity-70" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-100 rounded-full mix-blend-multiply filter blur-sm opacity-70" />
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4 font-display">
                  {item.title}
                </h3>
                <p className="text-slate-600 font-body">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50/50">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-[2rem] shadow-xl relative overflow-hidden"
            >
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
              <h2 className="text-3xl font-bold text-slate-800 mb-4 font-display">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto font-body">
                Join now to access all our features and start improving your skills today.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign Up Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
=======
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuthContext();

  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-education-600" />,
      title: "Comprehensive Practice",
      description:
        "Access a wide range of verbal and non-verbal reasoning questions tailored for 11+ exam preparation.",
      benefits: [
        "Diverse question types",
        "Structured learning paths",
        "Regular content updates"
      ]
    },
    {
      icon: <Brain className="w-12 h-12 text-education-600" />,
      title: "Brain Training Games",
      description:
        "Enhance cognitive skills with fun, interactive games and puzzles designed to boost learning.",
      benefits: [
        "Memory games",
        "Sudoku challenges",
        "Word puzzles",
        "Geography quizzes"
      ]
    },
    {
      icon: <Trophy className="w-12 h-12 text-education-600" />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and performance tracking.",
      benefits: [
        "Detailed statistics",
        "Progress visualization",
        "Performance insights"
      ]
    },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Master the 11+ Exam
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Comprehensive preparation for verbal and non-verbal reasoning with
          interactive practice and brain training.
        </p>
        {user ? (
          <div className="space-y-4">
            <Link
              to="/lets-practice"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors mx-2"
            >
              Start Practicing
            </Link>
            <Link
              to="/brain-training"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-education-600 border-2 border-education-600 rounded-lg hover:bg-education-50 transition-colors mx-2"
            >
              Play Brain Games
            </Link>
          </div>
        ) : (
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors"
          >
            Get Started
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <ul className="space-y-2">
              {feature.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
            {!user && (
              <div className="mt-4 flex items-center text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                Sign in to unlock
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="text-center bg-education-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Join now to access all our features and start improving your skills today.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-education-600 rounded-lg hover:bg-education-700 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      )}
    </div>
  );
};

export default Index;
