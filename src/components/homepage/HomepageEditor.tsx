
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PaintBrush } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Feature {
  icon: string;
  title: string;
  description: string;
  benefits: string[];
}

interface HomepageContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  features: Feature[];
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
      return data as HomepageContent;
    },
  });

  const [formData, setFormData] = useState<Partial<HomepageContent>>({
    hero_title: content?.hero_title || "",
    hero_subtitle: content?.hero_subtitle || "",
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("homepage_content")
        .upsert({
          id: content?.id || "default",
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Homepage content updated successfully",
      });
      refetch();
      setIsEditing(false);
    } catch (error) {
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
          <PaintBrush className="w-4 h-4" />
          {isEditing ? "Cancel Editing" : "Edit Content"}
        </Button>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Hero Title</Label>
            <Input
              id="hero_title"
              value={isEditing ? formData.hero_title : content?.hero_title}
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
              value={isEditing ? formData.hero_subtitle : content?.hero_subtitle}
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
