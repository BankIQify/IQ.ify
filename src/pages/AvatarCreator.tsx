
import { AvatarCreator as AvatarCreatorComponent } from "@/components/profile/AvatarCreator";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AvatarCreator = () => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Link to="/profile">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create Your Avatar</h1>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-100">
        <AvatarCreatorComponent />
      </div>
    </div>
  );
};

export default AvatarCreator;
