import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Users, Trophy, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  active_users: number;
  award_text: string;
  bubble_text: string;
  primary_button_text: string;
  secondary_button_text: string;
}

export const HeroManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    id: "1",
    title: "Connecting the Cognitive Dots To A Boundless Mind",
    subtitle: "Personalised learning experiences, expert-led questions, and interactive content to help you achieve your educational goals.",
    rating: 4.8,
    active_users: 5000,
    award_text: "Best Cognitive App 2023",
    bubble_text: "Grounded in neuroscience. Powered by personalised learning insights",
    primary_button_text: "Get Started",
    secondary_button_text: "Try Practice Questions"
  });

  const { data: content = heroContent, isError } = useQuery({
    queryKey: ["hero-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .single();
      if (error) {
        toast({
          title: "Error fetching hero content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as HeroContent;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: HeroContent) => {
      const { error } = await supabase
        .from("hero_content")
        .upsert([newContent]);
      if (error) {
        toast({
          title: "Error updating hero content",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-content"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Hero content updated successfully",
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hero Section</h2>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Main Title</label>
            <Input
              value={heroContent.title}
              onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtitle</label>
            <Textarea
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              disabled={!isEditing}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bubble Text</label>
            <Input
              value={heroContent.bubble_text}
              onChange={(e) => setHeroContent({ ...heroContent, bubble_text: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <Input
                  type="number"
                  value={heroContent.rating}
                  onChange={(e) => setHeroContent({ ...heroContent, rating: parseFloat(e.target.value) })}
                  disabled={!isEditing}
                  className="w-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Active Users</label>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <Input
                  type="number"
                  value={heroContent.active_users}
                  onChange={(e) => setHeroContent({ ...heroContent, active_users: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Award Text</label>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <Input
                value={heroContent.award_text}
                onChange={(e) => setHeroContent({ ...heroContent, award_text: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Button Text</label>
              <Input
                value={heroContent.primary_button_text}
                onChange={(e) => setHeroContent({ ...heroContent, primary_button_text: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Button Text</label>
              <Input
                value={heroContent.secondary_button_text}
                onChange={(e) => setHeroContent({ ...heroContent, secondary_button_text: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setHeroContent(content);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => updateMutation.mutate(heroContent)}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}; 