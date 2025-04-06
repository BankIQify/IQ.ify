import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { 
  type AvatarConfig, 
  defaultConfig, 
  generateAvatarUrl 
} from "./avatarConfig";

const MAX_RETRIES = 3;
const TIMEOUT_MS = 8000;

export const useAvatarCreator = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<AvatarConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Generate a new avatar URL based on the current config
  const generateNewAvatarUrl = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to generate avatar. Please try again in a few moments.",
      });
      setRetryCount(0);
      return '';
    }

    try {
      const url = generateAvatarUrl(config);
      console.log("Attempting to generate avatar (attempt", retryCount + 1, "of", MAX_RETRIES, ")");
      
      // Fetch the SVG content with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error('Request timed out');
      }, TIMEOUT_MS);
      
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const svgContent = await response.text();
      
      // Validate SVG content
      if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
        throw new Error('Invalid SVG content received');
      }
      
      // Convert SVG to data URL
      const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
      console.log("Successfully generated avatar");
      
      setAvatarUrl(dataUrl);
      setRetryCount(0);
      return dataUrl;
      
    } catch (error) {
      console.error("Error in avatar generation attempt", retryCount + 1, ":", error);
      setRetryCount(prev => prev + 1);
      
      // Add a small delay before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
      return generateNewAvatarUrl();
    }
  }, [config, toast, retryCount]);

  // Initialize with user's existing avatar config if available
  useEffect(() => {
    const initializeAvatar = async () => {
      if (!isInitialized && profile) {
        console.log("Initializing avatar with profile:", profile);
        
        try {
          if (profile?.avatar_config) {
            const savedConfig = profile.avatar_config as AvatarConfig;
            setConfig(prevConfig => ({
              ...prevConfig,
              ...savedConfig
            }));
          }
          
          if (profile?.avatar_url && profile.avatar_url.length > 10) {
            console.log("Using existing avatar URL from profile");
            setAvatarUrl(profile.avatar_url);
          } else {
            console.log("Generating new avatar URL");
            setRetryCount(0);
            await generateNewAvatarUrl();
          }
        } catch (error) {
          console.error("Error initializing avatar:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to initialize avatar. Please refresh the page.",
          });
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeAvatar();
  }, [profile, isInitialized, generateNewAvatarUrl, toast]);

  const refreshAvatar = useCallback(() => {
    setRetryCount(0);
    return generateNewAvatarUrl();
  }, [generateNewAvatarUrl]);

  const updateAvatarConfig = useCallback((key: keyof AvatarConfig, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      setRetryCount(0);
      generateNewAvatarUrl();
      return newConfig;
    });
  }, [generateNewAvatarUrl]);

  const saveAvatar = async () => {
    setLoading(true);
    try {
      if (!avatarUrl) {
        setRetryCount(0);
        const newUrl = await generateNewAvatarUrl();
        if (!newUrl) throw new Error("Failed to generate avatar URL");
      }
      
      await updateProfile({
        avatar_url: avatarUrl,
        avatar_config: config
      });
      
      toast({
        title: "Success",
        description: "Your avatar has been saved successfully!",
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
