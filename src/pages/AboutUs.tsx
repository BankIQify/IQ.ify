import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Trophy, Lock, CheckCircle, Target, Users, Clock, RefreshCw, Accessibility, Sparkles, Star, MessageSquare, Shield, Plus, ChevronRight, XCircle } from "lucide-react";
import "@/pages/AboutUs.css";
import "@/styles/fonts.css";

interface AboutCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const coreSkills: AboutCard[] = [
  {
    id: "1",
    title: "Strategic Thinking",
    description: "Sharpening logic and foresight with games that reward planning ahead",
    icon: <Brain className="w-8 h-8" />
  },
  {
    id: "2",
    title: "Creative Problem Solving",
    description: "Stretch your brain with challenges that value flexible thinking over one 'right' answer",
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    id: "3",
    title: "Spatial Awareness",
    description: "Level up your mental rotation, visualisation and spatial reasoning through puzzle play",
    icon: <Target className="w-8 h-8" />
  },
  {
    id: "4",
    title: "Memory",
    description: "Build focus and recall through quick fire sequences and smart repetition",
    icon: <BookOpen className="w-8 h-8" />
  }
];

const targetAudience: AboutCard[] = [
  {
    id: "1",
    title: "Young Learners",
    description: "Building foundational cognitive skills, early giving kids a smart head start",
    icon: <Users className="w-8 h-8" />
  },
  {
    id: "2",
    title: "Teens",
    description: "Prep for school exams or creative thinking projects with a confident mindset",
    icon: <Target className="w-8 h-8" />
  },
  {
    id: "3",
    title: "Adults",
    description: "Reignite your curiosity, stay sharp or boost your thinking for career transitions",
    icon: <RefreshCw className="w-8 h-8" />
  }
];

const whatMakesUsDifferent: string[] = [
  "Games rooted in cognitive science",
  "Designed for ages 7 to 99",
  "No pressure, no grind - just smarter play",
  "A platform that grows with you - whether you're learning, recovering, or just levelling up"
];

export default function AboutUs() {
  const { user } = useAuth();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[rgba(30,174,219,0.1)] to-[rgba(255,105,180,0.1)]">
      {/* Hero Section */}
      <div className="hero-section relative mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center typography-body"
        >
          <motion.h1 
            className="typography-h1 hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            IQify isn't about memorising more
          </motion.h1>
          <motion.p 
            className="typography-lead text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            It's about thinking smarter
          </motion.p>
          <motion.p 
            className="typography-body text-gray-600 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            As technology becomes part of everything we do, the way we learn, solve problems, and develop, needs to evolve to. Today's learners don't need more facts - they need better learning tools.
          </motion.p>
        </motion.div>
      </div>

      {/* Mission Statement */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center typography-body"
        >
          <h2 className="typography-h2 mb-6">Our Mission</h2>
          <p className="typography-body text-center text-gray-700 max-w-3xl mx-auto">
            To help minds of all ages build the skills that matter most - strategy, creativity, memory, and mental agility - through play that's backed by science and built to grow with you.
          </p>
        </motion.div>
      </div>

      {/* Core Skills Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="typography-h2 text-center mb-12">We focus on 4 core cognitive skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="about-card bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 card-pulse"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{skill.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{skill.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Why IQify Matters Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="section-separator mb-8" />
          <h2 className="typography-h2 text-center mb-12">Why IQify Matters</h2>
          <div className="max-w-4xl mx-auto text-center">
            <blockquote className="text-gray-700 mb-8">
              "The old way of learning isn't enough. We need to train minds that can adapt, analyse, and thrive in the real world."
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">The Numbers</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2 feature-slide">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>90% of jobs in Europe now require digital skills</span>
                  </li>
                  <li className="flex items-center gap-2 feature-slide">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>Students in India and China are completing years of school yet still struggling to find jobs (youth unemployment in China is 16.5% in 2025)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Access & Education</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2 feature-slide">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>50% of students report lacking proper access to digital devices or Internet at home</span>
                  </li>
                  <li className="flex items-center gap-2 feature-slide">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>Students are dropping out early - in some regions like Scotland over 14% left school before completing their final year</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-8 text-gray-700 feature-slide">
              All signs point to a simple truth: learning must go beyond textbooks. IQify helps bridge that gap. IQify is committed to making high quality cognitive training accessible to everyone, everywhere.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Who We're For Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="typography-h2 text-center mb-12">Who We're For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {targetAudience.map((audience, index) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="about-card bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 card-pulse"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    {audience.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{audience.title}</h3>
                  <p className="text-gray-600 text-center">{audience.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* What Makes Us Different Section */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="typography-h2 text-center mb-12">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whatMakesUsDifferent.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg feature-list"
              >
                <div className="flex items-center gap-4 feature-slide">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Final Word Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="typography-h2 text-center mb-6">Final Word</h2>
          <blockquote className="text-2xl italic text-gray-700 max-w-2xl mx-auto feature-slide">
            "Where curiosity meets confidence, and every brain gets a chance to shine. Join IQify - because your potential deserves to be trained"
          </blockquote>
        </motion.div>
      </div>

      {/* Pricing Section */}
      <div className="pricing-section">
        <div className="pricing-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="typography-h2 text-center mb-12">Choose Your Plan</h2>
            <div className="pricing-grid">
              {/* Explorer Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="pricing-card"
              >
                <div className="pricing-card-content">
                  <div className="text-center">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Explorer</h3>
                      <p className="text-gray-600">Yearly</p>
                    </div>
                    <div className="mb-4">
                      <div className="price text-2xl font-bold mb-1">£120</div>
                      <p className="text-gray-600">per year</p>
                      <p className="text-gray-600 mt-1">Or £15/month</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-green-600 text-sm">33% saving</p>
                    </div>
                    <div className="features-list">
                      <Feature included={true}>Exam Training</Feature>
                      <Feature included={true}>Standard Support</Feature>
                      <Feature included={true}>Progress Tracking</Feature>
                      <Feature included={true}>Games Access</Feature>
                    </div>
                  </div>
                </div>
                <Button className="w-full button-pulse">Start Exploring</Button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pricing-card pro"
              >
                <div className="pricing-card-content">
                  <div className="text-center">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Pro</h3>
                      <p className="text-gray-600">Yearly</p>
                    </div>
                    <div className="mb-4">
                      <div className="price text-2xl font-bold mb-1">£210</div>
                      <p className="text-gray-600">per year</p>
                      <p className="text-gray-600 mt-1">Or £25/month</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-green-600 text-sm">30% saving</p>
                    </div>
                    <div className="features-list">
                      <Feature included={true}>Exam Training</Feature>
                      <Feature included={true}>Extensive Development<br />Advice</Feature>
                      <Feature included={true}>Progress Tracking</Feature>
                      <Feature included={true}>Detailed Analytics</Feature>
                      <Feature included={true}>Games Access</Feature>
                    </div>
                  </div>
                </div>
                <Button className="w-full button-pulse">Get Pro</Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{ included: boolean; children: React.ReactNode }> = ({ included, children }) => (
  <div className="flex items-center gap-2 feature-slide">
    {included ? (
      <CheckCircle className="w-4 h-4 text-primary" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    )}
    <span className={included ? 'text-gray-900' : 'text-gray-400'}>{children}</span>
  </div>
);