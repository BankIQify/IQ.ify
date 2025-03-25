
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { ProfileData } from "@/types/auth/types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Attempting email sign in:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, profileData: ProfileData) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (data.user) {
      // Update profile with username and other data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          avatar_config: profileData.avatar_config,
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      // If focus areas are provided, insert them
      if (profileData.focus_areas && profileData.focus_areas.length > 0) {
        // Insert each focus area individually
        for (const area of profileData.focus_areas) {
          const { error: focusAreaError } = await supabase
            .from('user_focus_areas')
            .insert({
              user_id: data.user.id,
              focus_area: area as any // Type assertion as any to bypass strict type checking
            });

          if (focusAreaError) {
            console.error("Error inserting focus area:", focusAreaError);
            // Non-blocking error - continue with other areas
          }
        }
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    setUser, // Make sure we're exposing this
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut
  };
};
