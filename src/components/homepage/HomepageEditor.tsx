<<<<<<< HEAD
=======

>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
<<<<<<< HEAD
import { Paintbrush, Plus, Trash2 } from "lucide-react";
=======
import { Paintbrush } from "lucide-react"; // Fixed icon name (lowercase 'b')
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Json } from "@/integrations/supabase/types";
<<<<<<< HEAD
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916

interface Feature {
  icon: string;
  title: string;
  description: string;
<<<<<<< HEAD
}

interface Differentiator {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  avatar: string;
  quote: string;
=======
  benefits: string[];
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
}

interface HomepageContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  features: Feature[] | null;
<<<<<<< HEAD
  differentiators: Differentiator[] | null;
  social_proof: {
    rating: string;
    students: string;
    science: string;
  } | null;
  testimonials: Testimonial[] | null;
=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  created_at: string;
  updated_at: string;
}

export const HomepageEditor = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: content, refetch } = useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .single();

      if (error) throw error;
      
      // Transform the fetched data to match our expected type
      const transformedData: HomepageContent = {
        ...data,
<<<<<<< HEAD
        features: data.features ? (data.features as unknown as Feature[]) : [],
        differentiators: data.differentiators ? (data.differentiators as unknown as Differentiator[]) : [],
        social_proof: data.social_proof ? (data.social_proof as unknown as { rating: string; students: string; science: string }) : null,
        testimonials: data.testimonials ? (data.testimonials as unknown as Testimonial[]) : []
=======
        features: data.features ? (data.features as unknown as Feature[]) : []
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      };
      
      return transformedData;
    },
  });

  const [formData, setFormData] = useState<Partial<HomepageContent>>({
    hero_title: "",
    hero_subtitle: "",
<<<<<<< HEAD
    features: [],
    differentiators: [],
    social_proof: {
      rating: "4.8 rating",
      students: "Trusted by over 8,000+ students",
      science: "Backed by cognitive science"
    },
    testimonials: []
=======
    features: []
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  });

  // Update form data when content is loaded
  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title || "",
        hero_subtitle: content.hero_subtitle || "",
<<<<<<< HEAD
        features: content.features || [],
        differentiators: content.differentiators || [],
        social_proof: content.social_proof || {
          rating: "4.8 rating",
          students: "Trusted by over 8,000+ students",
          science: "Backed by cognitive science"
        },
        testimonials: content.testimonials || []
=======
        features: content.features || []
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      });
    }
  }, [content]);

  const handleSave = async () => {
    try {
<<<<<<< HEAD
      // Convert the features and differentiators arrays to a JSON compatible format
=======
      // Convert the features array to a JSON compatible format
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      const dataToSave = {
        id: content?.id || "default",
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
<<<<<<< HEAD
        features: formData.features as unknown as Json,
        differentiators: formData.differentiators as unknown as Json,
        social_proof: formData.social_proof as unknown as Json,
        testimonials: formData.testimonials as unknown as Json
=======
        features: formData.features as unknown as Json
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
      };

      const { error } = await supabase
        .from("homepage_content")
        .upsert(dataToSave);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Homepage content updated successfully",
      });
      refetch();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving homepage content:", error);
      toast({
        title: "Error",
        description: "Failed to update homepage content",
        variant: "destructive",
      });
    }
  };

<<<<<<< HEAD
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

  const addDifferentiator = () => {
    setFormData(prev => ({
      ...prev,
      differentiators: [...(prev.differentiators || []), { icon: "RefreshCw", title: "", description: "" }]
    }));
  };

  const removeDifferentiator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      differentiators: prev.differentiators?.filter((_, i) => i !== index)
    }));
  };

  const updateDifferentiator = (index: number, field: keyof Differentiator, value: string) => {
    setFormData(prev => ({
      ...prev,
      differentiators: prev.differentiators?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { 
        name: "", 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        quote: "" 
      }]
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

=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
  if (!content && !isEditing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Homepage Editor</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="gap-2"
        >
          <Paintbrush className="w-4 h-4" />
          {isEditing ? "Cancel Editing" : "Edit Content"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={isEditing ? formData.hero_title : content?.hero_title || ""}
              onChange={(e) =>
                setFormData({ ...formData, hero_title: e.target.value })
              }
              disabled={!isEditing}
              placeholder="Enter hero title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
            <Textarea
              id="hero_subtitle"
              value={isEditing ? formData.hero_subtitle : content?.hero_subtitle || ""}
              onChange={(e) =>
                setFormData({ ...formData, hero_subtitle: e.target.value })
              }
              disabled={!isEditing}
              placeholder="Enter hero subtitle"
            />
          </div>

<<<<<<< HEAD
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Features</Label>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              )}
            </div>
            {(isEditing ? formData.features : content?.features)?.map((feature, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Feature {index + 1}</Label>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Input
                  value={isEditing ? feature.title : feature.title}
                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Feature title"
                />
                <Textarea
                  value={isEditing ? feature.description : feature.description}
                  onChange={(e) => updateFeature(index, "description", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Feature description"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Differentiators</Label>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addDifferentiator}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Differentiator
                </Button>
              )}
            </div>
            {(isEditing ? formData.differentiators : content?.differentiators)?.map((item, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Differentiator {index + 1}</Label>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDifferentiator(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Input
                  value={isEditing ? item.title : item.title}
                  onChange={(e) => updateDifferentiator(index, "title", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Differentiator title"
                />
                <Textarea
                  value={isEditing ? item.description : item.description}
                  onChange={(e) => updateDifferentiator(index, "description", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Differentiator description"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Social Proof</Label>
            <div className="space-y-2">
              <Input
                value={isEditing ? formData.social_proof?.rating : content?.social_proof?.rating || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_proof: { ...formData.social_proof!, rating: e.target.value }
                  })
                }
                disabled={!isEditing}
                placeholder="Rating text"
              />
              <Input
                value={isEditing ? formData.social_proof?.students : content?.social_proof?.students || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_proof: { ...formData.social_proof!, students: e.target.value }
                  })
                }
                disabled={!isEditing}
                placeholder="Students text"
              />
              <Input
                value={isEditing ? formData.social_proof?.science : content?.social_proof?.science || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    social_proof: { ...formData.social_proof!, science: e.target.value }
                  })
                }
                disabled={!isEditing}
                placeholder="Science text"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Testimonials</Label>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addTestimonial}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              )}
            </div>
            {(isEditing ? formData.testimonials : content?.testimonials)?.map((testimonial, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Testimonial {index + 1}</Label>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTestimonial(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <Input
                    value={isEditing ? testimonial.name : testimonial.name}
                    onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Student name"
                    className="flex-1"
                  />
                </div>
                <Textarea
                  value={isEditing ? testimonial.quote : testimonial.quote}
                  onChange={(e) => updateTestimonial(index, "quote", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Testimonial quote"
                />
              </div>
            ))}
          </div>

=======
>>>>>>> 9b53aeac26cb6664558c884b2774875971f06916
          {isEditing && (
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
