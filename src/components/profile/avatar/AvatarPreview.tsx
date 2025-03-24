
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Profile } from "@/types/auth/types";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface AvatarPreviewProps {
  avatarUrl: string;
  loading: boolean;
  saveAvatar: () => Promise<void>;
  profile: Profile | null;
  refreshAvatar?: () => void;
}

export const AvatarPreview = ({ 
  avatarUrl, 
  loading, 
  saveAvatar,
  profile,
  refreshAvatar
}: AvatarPreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  // Force reload the avatar image when it fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Avatar image failed to load", e);
    setImageError(true);
    
    if (loadAttempts < 3) {
      // Add a timestamp to force a reload
      const newSrc = `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
      e.currentTarget.src = newSrc;
      console.log("Retrying with new URL:", newSrc);
      setLoadAttempts(prev => prev + 1);
    }
  };
  
  const handleImageLoad = () => {
    console.log("Avatar image loaded successfully");
    setImageError(false);
    setLoadAttempts(0);
  };
  
  const handleRefreshAvatar = () => {
    if (refreshAvatar) {
      setImageError(false);
      setLoadAttempts(0);
      refreshAvatar();
    }
  };

  return (
    <div className="md:w-1/3 flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Avatar</h2>
        <p className="text-gray-500">Customize your personal avatar</p>
      </div>
      
      <div className="relative">
        <Avatar className="w-48 h-48 mb-6 border-2 border-gray-200">
          {avatarUrl && !imageError ? (
            <AvatarImage 
              src={avatarUrl} 
              alt="User avatar" 
              onError={handleImageError}
              onLoad={handleImageLoad}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-4xl">
              {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        
        {refreshAvatar && (
          <button 
            onClick={handleRefreshAvatar}
            className="absolute top-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
            title="Refresh avatar"
          >
            <RefreshCw size={16} />
          </button>
        )}
        
        {/* Status info */}
        {!avatarUrl && (
          <p className="text-xs text-red-500 mt-2">No avatar URL available</p>
        )}
        
        {imageError && (
          <p className="text-xs text-red-500 mt-2">Failed to load avatar image</p>
        )}
        
        {avatarUrl && !imageError && (
          <p className="text-xs text-gray-500 mt-2 break-all max-w-full">
            Avatar loaded successfully
          </p>
        )}
      </div>
      
      <Button 
        onClick={saveAvatar} 
        className="w-full"
        disabled={loading || imageError}
      >
        {loading ? "Saving..." : "Save Avatar"}
      </Button>
    </div>
  );
};
