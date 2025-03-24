
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { 
  type AvatarConfig, 
  defaultConfig, 
  generateAvatarUrl 
} from "./avatarConfig";

export const useAvatarCreator = () => {
  const { profile, updateProfile } = useAuthContext();
  const { toast } = useToast();
  const [config, setConfig] = useState<AvatarConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate a new avatar URL based on the current config
  const generateNewAvatarUrl = useCallback(() => {
    try {
      const url = generateAvatarUrl(config);
      console.log("Generated fresh avatar URL:", url);
      setAvatarUrl(url);
      return url;
    } catch (error) {
      console.error("Error generating avatar URL:", error);
      return '';
    }
  }, [config]);

  // Initialize with user's existing avatar config if available
  useEffect(() => {
    console.log("Profile data loaded:", profile);
    
    if (!isInitialized && profile) {
      if (profile?.avatar_config) {
        try {
          console.log("Found avatar config in profile:", profile.avatar_config);
          const savedConfig = profile.avatar_config as AvatarConfig;
          setConfig(prevConfig => ({
            ...prevConfig,
            ...savedConfig
          }));
        } catch (e) {
          console.error("Error parsing avatar config:", e);
        }
      }
      
      // Short delay to ensure config is updated before URL generation
      setTimeout(() => {
        if (profile?.avatar_url && profile.avatar_url.length > 10) {
          console.log("Using existing avatar URL from profile:", profile.avatar_url);
          setAvatarUrl(profile.avatar_url);
        } else {
          // Force a new URL generation if none exists or it's invalid
          generateNewAvatarUrl();
        }
        setIsInitialized(true);
      }, 100);
    }
  }, [profile, isInitialized, generateNewAvatarUrl]);

  const refreshAvatar = useCallback(() => {
    generateNewAvatarUrl();
  }, [generateNewAvatarUrl]);

  const updateAvatarConfig = useCallback((key: keyof AvatarConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      // Generate new URL after config update
      setTimeout(() => {
        const url = generateAvatarUrl(newConfig);
        console.log(`Updated ${key} to ${value}, new avatar URL:`, url);
        setAvatarUrl(url);
      }, 0);
      return newConfig;
    });
  }, []);

  const saveAvatar = async () => {
    setLoading(true);
    try {
      console.log("Saving avatar with URL:", avatarUrl);
      console.log("Config being saved:", config);
      
      if (!avatarUrl) {
        throw new Error("No avatar URL to save");
      }
      
      await updateProfile({
        avatar_url: avatarUrl,
        avatar_config: config
      });
      
      toast({
        title: "Avatar saved",
        description: "Your new avatar has been saved successfully!",
      });
    } catch (error) {
      console.error("Error saving avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your avatar. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    avatarUrl,
    loading,
    updateAvatarConfig,
    saveAvatar,
    refreshAvatar,
    profile
  };
};
