
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Paintbrush } from "lucide-react"; // Fixed icon name (lowercase 'b')
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Json } from "@/integrations/supabase/types";

interface Feature {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

interface HomepageContent {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  features: Feature[] | null;
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
        features: data.features ? (data.features as unknown as Feature[]) : []
      };
      
      return transformedData;
    },
  });

  const [formData, setFormData] = useState<Partial<HomepageContent>>({
    hero_title: "",
    hero_subtitle: "",
    features: []
  });

  // Update form data when content is loaded
  useEffect(() => {
    if (content) {
      setFormData({
        hero_title: content.hero_title || "",
        hero_subtitle: content.hero_subtitle || "",
        features: content.features || []
      });
    }
  }, [content]);

  const handleSave = async () => {
    try {
      // Convert the features array to a JSON compatible format
      const dataToSave = {
        id: content?.id || "default",
        hero_title: formData.hero_title,
        hero_subtitle: formData.hero_subtitle,
        features: formData.features as unknown as Json
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
