import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WhyChooseIqifyEditor } from "./WhyChooseIqifyEditor";

interface Feature {
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
  cta: {
    title: string;
    description: string;
  };
}

export const AboutUsManager = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<AboutUsContent>({
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
    cta: {
      title: "Ready to Begin Your Journey?",
      description: "Join thousands of users who are already enhancing their cognitive abilities with IQify."
    }
  });

  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      icon: "Brain",
      title: "New Feature",
      description: "Description of the new feature"
    };
    setContent(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const removeFeature = (id: string) => {
    setContent(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id)
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('about_us_content')
        .upsert({ id: 1, content });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About Us content has been updated",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.hero.title}
              onChange={(e) => setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, title: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={content.hero.subtitle}
              onChange={(e) => setContent(prev => ({
                ...prev,
                hero: { ...prev.hero, subtitle: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Mission Statement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.mission.title}
              onChange={(e) => setContent(prev => ({
                ...prev,
                mission: { ...prev.mission, title: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.mission.description}
              onChange={(e) => setContent(prev => ({
                ...prev,
                mission: { ...prev.mission, description: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.features.map((feature, index) => (
            <div key={feature.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Feature {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeFeature(feature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <Input
                  value={feature.icon}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, icon: e.target.value };
                    setContent(prev => ({ ...prev, features: newFeatures }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={feature.title}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, title: e.target.value };
                    setContent(prev => ({ ...prev, features: newFeatures }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={feature.description}
                  onChange={(e) => {
                    const newFeatures = [...content.features];
                    newFeatures[index] = { ...feature, description: e.target.value };
                    setContent(prev => ({ ...prev, features: newFeatures }));
                  }}
                />
              </div>
            </div>
          ))}
          <Button onClick={addFeature} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardHeader>
          <CardTitle>Why Choose IQify</CardTitle>
        </CardHeader>
        <CardContent>
          <WhyChooseIqifyEditor />
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.cta.title}
              onChange={(e) => setContent(prev => ({
                ...prev,
                cta: { ...prev.cta, title: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.cta.description}
              onChange={(e) => setContent(prev => ({
                ...prev,
                cta: { ...prev.cta, description: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}; 