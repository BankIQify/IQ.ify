
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Profile } from "@/types/auth/types";

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
  return (
    <div className="md:w-1/3 flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Your Avatar</h2>
        <p className="text-gray-500">Customize your personal avatar</p>
      </div>
      
      <div className="relative">
        <Avatar className="w-48 h-48 mb-6">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User avatar" />
          ) : (
            <AvatarFallback>
              {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "?"}
            </AvatarFallback>
          )}
        </Avatar>
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
