
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Profile } from "@/types/auth/types";
import { RefreshCw } from "lucide-react";

interface AvatarPreviewProps {
  avatarUrl: string;
  loading: boolean;
  saveAvatar: () => Promise<void>;
  profile: Profile | null;
}

export const AvatarPreview = ({ 
  avatarUrl, 
  loading, 
  saveAvatar,
  profile
}: AvatarPreviewProps) => {
  // Force reload the avatar image when it fails to load
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Avatar image failed to load");
    // Add a timestamp to force a reload
    e.currentTarget.src = `${avatarUrl}${avatarUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
  };

  return (
    <div className="md:w-1/3 flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Avatar</h2>
        <p className="text-gray-500">Customize your personal avatar</p>
      </div>
      
      <div className="relative">
        <Avatar className="w-48 h-48 mb-6">
          {avatarUrl ? (
            <AvatarImage 
              src={avatarUrl} 
              alt="User avatar" 
              onError={handleImageError}
            />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-4xl">
              {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          )}
        </Avatar>
        
        {/* Debug info */}
        {!avatarUrl && (
          <p className="text-xs text-red-500 mt-2">No avatar URL available</p>
        )}
        
        {avatarUrl && (
          <p className="text-xs text-gray-500 mt-2 break-all max-w-full">
            URL: {avatarUrl.substring(0, 50)}...
          </p>
        )}
      </div>
      
      <Button 
        onClick={saveAvatar} 
        className="w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Avatar"}
      </Button>
    </div>
  );
};
