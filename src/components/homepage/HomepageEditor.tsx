import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Paintbrush, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Json } from "@/integrations/supabase/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StatsManager } from "@/components/admin/StatsManager";

interface HomepageContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  features: Feature[] | null;
  social_proof: {
    rating: string;
    students: string;
    science: string;
  } | null;
  testimonials: Testimonial[] | null;
  stats_cards: {
    id: string;
    highlight: string;
    supportingText: string;
  }[] | null;
  created_at: string;
  updated_at: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  avatar: string;
  quote: string;
}

interface StatsCard {
  id: string;
  highlight: string;
  supportingText: string;
}

interface SocialProof {
  rating: string;
  students: string;
  science: string;
}

export const HomepageEditor = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: content, refetch } = useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data: rawData, error } = await supabase
        .from("homepage_content")
        .select("*")
        .limit(1)
        .single();
    
      if (error) throw error;
    
      // Type assertion to match our expected type
      const data = rawData as unknown as HomepageContent;
    
      // Transform the fetched data to match our expected type
      const transformedData: HomepageContent = {
        id: data.id,
        hero_title: typeof data.hero_title === 'string' ? data.hero_title : "",
        hero_subtitle: typeof data.hero_subtitle === 'string' ? data.hero_subtitle : "",
        features: Array.isArray(data.features) ? data.features : [],
        social_proof: typeof data.social_proof === 'object' ? {
          rating: typeof data.social_proof.rating === 'string' ? data.social_proof.rating : "4.8 rating",
          students: typeof data.social_proof.students === 'string' ? data.social_proof.students : "Trusted by over 8,000+ students",
          science: typeof data.social_proof.science === 'string' ? data.social_proof.science : "Backed by cognitive science"
        } : {
          rating: "4.8 rating",
          students: "Trusted by over 8,000+ students",
          science: "Backed by cognitive science"
        },
        testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
        stats_cards: Array.isArray(data.stats_cards) ? data.stats_cards : [],
        created_at: typeof data.created_at === 'string' ? data.created_at : new Date().toISOString(),
        updated_at: typeof data.updated_at === 'string' ? data.updated_at : new Date().toISOString()
      };
    
      return transformedData;
    }
  });

  const [formData, setFormData] = useState<HomepageContent>({
    id: crypto.randomUUID(),
    hero_title: null,
    hero_subtitle: null,
    features: [{
      icon: "",
      title: "",
      description: ""
    }],
    social_proof: {
      rating: "4.8 rating",
      students: "Trusted by over 8,000+ students",
      science: "Backed by cognitive science"
    },
    testimonials: [{
      name: "",
      avatar: "",
      quote: ""
    }],
    stats_cards: [{
      id: crypto.randomUUID(),
      highlight: "",
      supportingText: ""
    }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Update form data when content is loaded
  useEffect(() => {
    if (content) {
      setFormData({
        id: content.id,
        hero_title: content.hero_title ?? "",
        hero_subtitle: content.hero_subtitle ?? "",
        features: content.features ?? [],
        social_proof: {
          rating: formData.social_proof?.rating || null,
          students: formData.social_proof?.students || null,
          science: formData.social_proof?.science || null
        },
        testimonials: content.testimonials ?? [],
        stats_cards: content.stats_cards ?? [],
        created_at: content.created_at,
        updated_at: content.updated_at
      });
    }
  }, [content]);
  const handleSave = async () => {
    try {
      if (!content?.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No content record found to update",
        });
        return;
      }
  
      const dataToSave: Partial<HomepageContent> = {
        hero_title: formData.hero_title === "" ? null : formData.hero_title,
        hero_subtitle: formData.hero_subtitle === "" ? null : formData.hero_subtitle,
        features: formData.features.length === 0 ? null : formData.features,
        social_proof: {
          rating: formData.social_proof?.rating || null,
          students: formData.social_proof?.students || null,
          science: formData.social_proof?.science || null
        },
        testimonials: formData.testimonials.length === 0 ? null : formData.testimonials,
        stats_cards: formData.stats_cards.length === 0 ? null : formData.stats_cards
      };
  
      const { error } = await supabase
        .from("homepage_content")
        .update(dataToSave)
        .eq('id', content.id);
  
      toast({
        title: "Success",
        description: "Homepage content updated successfully",
      });
      
      refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving homepage content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      });
    }
  };


  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { icon: "Target", title: "", description: "" }]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { name: "", avatar: "", quote: "" }]
    }));
  };

  const removeTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials?.filter((_, i) => i !== index)
    }));
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials?.map((testimonial, i) => 
        i === index ? { ...testimonial, [field]: value } : testimonial
      )
    }));
  };

  const updateSocialProof = (field: keyof SocialProof, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_proof: {
        rating: prev.social_proof?.rating ?? "",
        students: prev.social_proof?.students ?? "",
        science: prev.social_proof?.science ?? "",
        [field]: value
      }
    }));
  };

  if (!content && !isEditing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Homepage Editor</h2>
        <Button 
          variant={isEditing ? "secondary" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          <Paintbrush className="w-4 h-4 mr-2" />
          {isEditing ? "Cancel Editing" : "Edit Content"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hero_title">Title</Label>
                <Input
                  id="hero_title"
                  value={formData.hero_title ?? ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">Subtitle</Label>
                <Textarea
                  id="hero_subtitle"
                  value={formData.hero_subtitle ?? ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="Enter hero subtitle"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Features</h3>
              <Button onClick={addFeature} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-6">
              {formData.features?.map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div>
                    <Label>Icon Name</Label>
                    <Input
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, "icon", e.target.value)}
                      placeholder="Icon name (e.g., Target, Star)"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                      placeholder="Feature description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Social Proof</h3>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <Input
                  value={formData.social_proof?.rating ?? ""}
                  onChange={(e) => updateSocialProof("rating", e.target.value)}
                  placeholder="e.g., 4.8 rating"
                />
              </div>
              <div>
                <Label>Students</Label>
                <Input
                  value={formData.social_proof?.students ?? ""}
                  onChange={(e) => updateSocialProof("students", e.target.value)}
                  placeholder="e.g., Trusted by over 8,000+ students"
                />
              </div>
              <div>
                <Label>Science</Label>
                <Input
                  value={formData.social_proof?.science ?? ""}
                  onChange={(e) => updateSocialProof("science", e.target.value)}
                  placeholder="e.g., Backed by cognitive science"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Testimonials</h3>
              <Button onClick={addTestimonial} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>
            <div className="space-y-6">
              {formData.testimonials?.map((testimonial, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => removeTestimonial(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      {testimonial.avatar ? (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      ) : (
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                          placeholder="Student name"
                        />
                      </div>
                      <div>
                        <Label>Avatar URL</Label>
                        <Input
                          value={testimonial.avatar}
                          onChange={(e) => updateTestimonial(index, "avatar", e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Quote</Label>
                    <Textarea
                      value={testimonial.quote}
                      onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                      placeholder="Student testimonial"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Stats Cards</h3>
            <StatsManager
              initialStats={formData.stats_cards ?? []}
              onSave={(stats) => setFormData(prev => ({ ...prev, stats_cards: stats }))}
            />
          </Card>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Hero Section</h3>
            <div className="space-y-2">
              <p className="font-medium">{content?.hero_title}</p>
              <p className="text-gray-600">{content?.hero_subtitle}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {content?.features?.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Social Proof</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <p className="font-medium">{content?.social_proof?.rating}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium">{content?.social_proof?.students}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="font-medium">{content?.social_proof?.science}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Testimonials</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {content?.testimonials?.map((testimonial, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      {testimonial.avatar ? (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      ) : (
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <p className="font-medium">{testimonial.name}</p>
                  </div>
                  <p className="text-gray-600 italic">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Stats Cards</h3>
            <div className="grid gap-4">
              {content?.stats_cards?.map((card) => (
                <div key={card.id} className="p-4 border rounded-lg">
                  <p className="font-medium">{card.highlight}</p>
                  <p className="text-gray-600">{card.supportingText}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
