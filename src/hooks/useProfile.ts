
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile, ProfileData } from "@/types/auth/types";
import { User } from "@supabase/supabase-js";
import { useToast } from "./use-toast";

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const getProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        // Fetch focus areas
        const { data: focusAreasData, error: focusAreasError } = await supabase
          .from("user_focus_areas")
          .select("focus_area")
          .eq("user_id", userId);

        if (focusAreasError) {
          console.error("Error fetching focus areas:", focusAreasError);
        } else {
          data.focus_areas = focusAreasData?.map(fa => fa.focus_area) || [];
        }

        // Convert avatar_config from Json to Record<string, any>
        const typedProfile: Profile = {
          ...data,
          avatar_config: data.avatar_config as Record<string, any> || null
        };
        
        setProfile(typedProfile);
      }
    } catch (error) {
      console.error("Error in getProfile:", error);
      setProfile(null);
    }
  };

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh profile data
      await getProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile.",
      });
      throw error;
    }
  };

  return {
    profile,
    getProfile,
    updateProfile
  };
};
