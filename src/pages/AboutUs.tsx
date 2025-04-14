import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Brain, 
  Users, 
  Target, 
  Award, 
  BookOpen, 
  Sparkles, 
  Star,
  LucideIcon,
  type LucideProps,
  BarChart,
  Lightbulb,
  Rocket,
  Zap,
  Trophy,
  Heart,
  Smile,
  Coffee,
  Book,
  Laptop,
  Palette,
  PenTool,
  Puzzle,
  Shield,
  Sun,
  Compass,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseUs {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AboutUsContent {
  hero: {
    title: string;
    subtitle: string;
  };
  mission: {
    title: string;
    description: string;
  };
  features: Feature[];
  whyChooseUs: WhyChooseUs[];
  cta: {
    title: string;
    description: string;
  };
}

const defaultContent: AboutUsContent = {
  hero: {
    title: "About IQify",
    subtitle: "Empowering minds through innovative cognitive assessment and development"
  },
  mission: {
    title: "Our Mission",
    description: "To provide accessible, engaging, and scientifically-backed cognitive assessment tools that help individuals understand and enhance their intellectual capabilities."
  },
  features: [
    {
      id: "1",
      icon: "Brain",
      title: "Comprehensive Testing",
      description: "From verbal reasoning to non-verbal challenges, our platform offers a wide range of cognitive assessments."
    },
    {
      id: "2",
      icon: "Target",
      title: "Personalised Learning",
      description: "Adaptive algorithms ensure each user receives a tailored experience that grows with their progress."
    },
    {
      id: "3",
      icon: "Sparkles",
      title: "AI-Powered",
      description: "Leveraging cutting-edge AI technology to provide accurate assessments and intelligent feedback."
    }
  ],
  whyChooseUs: [
    {
      id: "1",
      icon: "BookOpen",
      title: "Research-Based",
      description: "Our assessments are grounded in established psychological research and cognitive science."
    },
    {
      id: "2",
      icon: "Users",
      title: "Community-Driven",
      description: "Join a growing community of learners committed to cognitive development and personal growth."
    },
    {
      id: "3",
      icon: "Award",
      title: "Expert-Crafted",
      description: "Questions and puzzles designed by educational experts and cognitive psychologists."
    },
    {
      id: "4",
      icon: "Target",
      title: "Goal-Oriented",
      description: "Clear progress tracking and achievement systems to help you reach your cognitive goals."
    }
  ],
  cta: {
    title: "Ready to Begin Your Journey?",
    description: "Join thousands of users who are already enhancing their cognitive abilities with IQify."
  }
};

const iconMap: { [key: string]: LucideIcon } = {
  Brain,
  Users,
  Target,
  Award,
  BookOpen,
  Sparkles,
  Star,
  BarChart,
  Lightbulb,
  Rocket,
  Zap,
  Trophy,
  Heart,
  Smile,
  Coffee,
  Book,
  Laptop,
  Palette,
  PenTool,
  Puzzle,
  Shield,
  Sun,
  Compass
};

const Feature: React.FC<{ included: boolean; children: React.ReactNode }> = ({ included, children }) => (
  <div className="flex items-center gap-2">
    {included ? (
      <CheckCircle2 className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-gray-400" />
    )}
    <span className={included ? 'text-gray-900' : 'text-gray-400'}>{children}</span>
  </div>
);

const AboutUs: React.FC = () => {
  const { user, profile } = useAuth();
  const [content, setContent] = useState<AboutUsContent>(defaultContent);
  const [showPricing, setShowPricing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (plan: 'user' | 'pro') => {
    try {
      // For now, just redirect to the auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from('about_us_content')
        .select('content')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching content:', error);
        return;
      }

      if (data?.content) {
        setContent(data.content as AboutUsContent);
      }
    };

    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">About IQify</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            At IQify, we're dedicated to helping individuals enhance their cognitive abilities through scientifically-backed training methods. Our platform combines cutting-edge technology with proven educational techniques to provide a comprehensive learning experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Personalised cognitive training programs</li>
            <li>Comprehensive practice tests</li>
            <li>Detailed performance analytics</li>
            <li>Expert guidance and support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Pricing</h2>
          <p className="text-gray-600 mb-4">
            We offer flexible subscription plans to suit different needs and budgets. Click below to view our pricing options.
          </p>
          
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={() => setShowPricing(!showPricing)}
          >
            {showPricing ? 'Hide Pricing' : 'View Pricing Plans'}
          </Button>

          {showPricing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Plan */}
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>User</CardTitle>
                  <CardDescription>Perfect for students and individual learners</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold">£15</div>
                        <div className="text-sm text-gray-500">/month</div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">£120</div>
                        <div className="text-sm text-gray-500">/year</div>
                        <div className="text-sm text-green-600">Save 33%</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Feature included={true}>Basic training modules</Feature>
                      <Feature included={true}>Standard support</Feature>
                      <Feature included={true}>Progress tracking</Feature>
                      <Feature included={true}>Practice tests</Feature>
                      <Feature included={true}>Basic analytics</Feature>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => handleSubscribe('user')}
                    disabled={isLoading || profile?.subscription_tier === 'user'}
                  >
                    {isLoading ? 'Processing...' : profile?.subscription_tier === 'user' ? 'Current Plan' : 'Sign Up Now'}
                  </Button>
                </CardFooter>
              </Card>

              {/* Pro-User Plan */}
              <Card className="flex flex-col border-primary">
                <CardHeader>
                  <CardTitle>Pro-User</CardTitle>
                  <CardDescription>For serious learners and professionals</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold">£25</div>
                        <div className="text-sm text-gray-500">/month</div>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold">£210</div>
                        <div className="text-sm text-gray-500">/year</div>
                        <div className="text-sm text-green-600">Save 30%</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Feature included={true}>Everything in User plan</Feature>
                      <Feature included={true}>Advanced training modules</Feature>
                      <Feature included={true}>Priority support</Feature>
                      <Feature included={true}>Custom training plans</Feature>
                      <Feature included={true}>Detailed analytics</Feature>
                      <Feature included={true}>Exclusive content</Feature>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => handleSubscribe('pro')}
                    disabled={isLoading || profile?.subscription_tier === 'pro'}
                  >
                    {isLoading ? 'Processing...' : profile?.subscription_tier === 'pro' ? 'Current Plan' : 'Sign Up Now'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions? We'd love to hear from you. Reach out to our support team at support@iqify.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs; 