import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { type Profile } from "@/types/auth/types";

interface DashboardHeaderProps {
  profile: Profile;
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile.name || profile.username || "Scholar"}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* PRO Banner for PRO users */}
        {profile.subscription_status === 'active' && profile.subscription_tier === 'pro' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative">
              {/* Ribbon Background */}
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-yellow-400/20 transform rotate-45 rounded-full blur-lg"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-400/20 transform rotate-45 rounded-full blur-lg"></div>

              {/* Ribbon */}
              <div className="relative bg-yellow-400 text-white px-6 py-2 rounded-full shadow-lg">
                <div className="text-sm font-bold">PRO</div>
              </div>

              {/* Trophy Icon */}
              <div className="absolute -left-2 -top-2 transform rotate-45">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2L14.293 5.293L17.586 2L22 7L19.414 9.586L21.707 13L24 15.293L19.414 20.886L17.586 23L12 18L6.414 23L4.586 20.886L0 15.293L2.293 13L4.586 9.586L1.914 7L6.414 2L8.707 5.293L12 2z"/>
                  </svg>
                </div>
              </div>

              {/* Ribbon Ends */}
              <div className="absolute -right-2 -bottom-2 transform rotate-45">
                <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="mt-2 text-sm text-gray-600">
              <div className="font-medium">Pro Plan</div>
              <div>Active until {profile.subscription_expires_at?.split('T')[0]}</div>
            </div>
          </motion.div>
        )}

        <Link to="/profile">
          <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="User avatar" />
            ) : (
              <AvatarFallback>
                {profile.name?.charAt(0) || profile.username?.charAt(0) || "?"}
              </AvatarFallback>
            )}
          </Avatar>
        </Link>
      </div>
    </div>
  );
};
