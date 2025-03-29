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
    <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Avatar</h2>
        <p className="text-gray-500">Customise your personal avatar</p>
      </div>
      
      <div className="relative mb-6">
        <div className="bg-white rounded-full p-2 shadow-lg">
          <Avatar className="w-48 h-48 border-4 border-white">
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
        </div>
        
        {refreshAvatar && (
          <button 
            onClick={handleRefreshAvatar}
            className="absolute top-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Refresh avatar"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Status messages */}
      <div className="min-h-[2rem] mb-4 text-center">
        {!avatarUrl && (
          <p className="text-sm text-red-500">No avatar URL available</p>
        )}
        
        {imageError && (
          <p className="text-sm text-red-500">Failed to load avatar image</p>
        )}
        
        {avatarUrl && !imageError && (
          <p className="text-sm text-green-500">Avatar loaded successfully</p>
        )}
      </div>
      
      <Button 
        onClick={saveAvatar} 
        className="w-full bg-education-600 hover:bg-education-700"
        disabled={loading || imageError}
      >
        {loading ? "Saving..." : "Save Avatar"}
      </Button>
    </div>
  );
};
