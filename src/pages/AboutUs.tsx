import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Compass
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export const AboutUs = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<AboutUsContent>(defaultContent);

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
        setContent(data.content);
      }
    };

    fetchContent();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{content.hero.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.hero.subtitle}
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">{content.mission.title}</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {content.mission.description}
        </p>
      </Card>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {content.features.map((feature) => (
          <Card key={feature.id} className="p-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              {iconMap[feature.icon] ? (
                React.createElement(iconMap[feature.icon], {
                  className: "h-6 w-6 text-primary"
                })
              ) : (
                <Brain className="h-6 w-6 text-primary" />
              )}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Why Choose IQify?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {content.whyChooseUs.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {iconMap[item.icon] ? (
                  React.createElement(iconMap[item.icon], {
                    className: "h-5 w-5 text-primary"
                  })
                ) : (
                  <Star className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">{content.cta.title}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {content.cta.description}
        </p>
        <div className="flex gap-4 justify-center">
          {!user ? (
            <>
              <Button size="lg" asChild>
                <Link to="/auth">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/auth">View Plans</Link>
              </Button>
            </>
          ) : (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 