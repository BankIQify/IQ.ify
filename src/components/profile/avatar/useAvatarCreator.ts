
import { useState, useEffect } from "react";
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

  // Initialize with user's existing avatar config if available
  useEffect(() => {
    if (profile?.avatar_config) {
      try {
        const savedConfig = profile.avatar_config as AvatarConfig;
        setConfig(prevConfig => ({
          ...prevConfig,
          ...savedConfig
        }));
      } catch (e) {
        console.error("Error parsing avatar config:", e);
      }
    }
    
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    } else {
      const url = generateAvatarUrl(config);
      setAvatarUrl(url);
    }
  }, [profile]);

  const updateAvatarConfig = (key: keyof AvatarConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      const url = generateAvatarUrl(newConfig);
      setAvatarUrl(url);
      return newConfig;
    });
  };

  const saveAvatar = async () => {
    setLoading(true);
    try {
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
    profile
  };
};
