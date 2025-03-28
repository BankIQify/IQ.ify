import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { ProfileData } from "@/types/auth/types";
import { handleAuthError } from "@/components/auth/AuthUtils";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Attempting email sign in:', email);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        handleAuthError(error, toast);
        throw error;
      }

      console.log('Sign in successful, user:', data.user?.id);
      return data;
    } catch (error) {
      console.error('Unexpected error during email sign in:', error);
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    console.log('Attempting Google sign in');
    try {
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        handleAuthError(error, toast);
        throw error;
      }

      console.log('Google sign in initiated successfully');
      return data;
    } catch (error) {
      console.error('Unexpected error during Google sign in:', error);
      toast({
        title: "Google Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, profileData: ProfileData) => {
    console.log('Attempting sign up for:', email);
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: profileData.name,
            username: profileData.username,
          }
        }
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        handleAuthError(signUpError, toast);
        throw signUpError;
      }

      if (data.user) {
        console.log('User created successfully, updating profile for user:', data.user.id);
        // Update profile with all user data
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            username: profileData.username,
            avatar_url: profileData.avatar_url,
            avatar_config: profileData.avatar_config,
            full_name: profileData.fullName,
            date_of_birth: profileData.dateOfBirth,
            country: profileData.country,
            city: profileData.city,
            education_level: profileData.educationLevel,
            subjects: profileData.subjects || [],
            focus_areas: profileData.focus_areas || []
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast({
            title: "Profile Update Error",
            description: "Created your account but couldn't save profile details. Please update your profile later.",
            variant: "destructive",
          });
          throw profileError;
        }

        // If focus areas are provided, insert them
        if (profileData.focus_areas && profileData.focus_areas.length > 0) {
          console.log('Adding focus areas for user:', data.user.id);
          const focusAreasToInsert = profileData.focus_areas.map(area => ({
            user_id: data.user!.id,
            focus_area: area
          }));

          const { error: focusAreasError } = await supabase
            .from('user_focus_areas')
            .insert(focusAreasToInsert);

          if (focusAreasError) {
            console.error("Error inserting focus areas:", focusAreasError);
            toast({
              title: "Focus Areas Error",
              description: "Created your account but couldn't save your focus areas. You can update these later.",
              variant: "destructive",
            });
            // Non-blocking error - don't throw to avoid blocking signup
          }
        }

        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }

      return data;
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      toast({
        title: "Sign Up Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign Out Error",
          description: error.message || "Failed to sign out properly.",
          variant: "destructive",
        });
        throw error;
      }
      console.log('Sign out successful');
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast({
        title: "Sign Out Error",
        description: "An unexpected error occurred while signing out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    user,
    setUser,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut
  };
};
