
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
      console.log("Fetching profile for user:", userId);
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
        console.log("Profile retrieved:", data.id);
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
          avatar_config: data.avatar_config as Record<string, any> || {}
        };
        
        setProfile(typedProfile);
      } else {
        console.log("No profile found for user:", userId);
      }
    } catch (error) {
      console.error("Error in getProfile:", error);
      setProfile(null);
    }
  };

  const updateProfile = async (profileData: Partial<ProfileData>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      console.log("Updating profile for user:", user.id);
      // Handle basic profile data (excluding focus_areas)
      const { focus_areas, ...basicProfileData } = profileData;
      
      // Update the basic profile data
      const { error } = await supabase
        .from('profiles')
        .update(basicProfileData)
        .eq('id', user.id);

      if (error) throw error;
      
      // Handle focus areas separately if they exist
      if (focus_areas && focus_areas.length > 0) {
        // First delete existing focus areas
        await supabase
          .from('user_focus_areas')
          .delete()
          .eq('user_id', user.id);
          
        // Then add the new ones
        for (const area of focus_areas) {
          await supabase
            .from('user_focus_areas')
            .insert({
              user_id: user.id,
              focus_area: area as any
            });
        }
      }
      
      // Refresh profile data
      await getProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      console.log("Profile successfully updated");
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
