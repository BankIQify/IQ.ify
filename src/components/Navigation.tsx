import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon, User, Settings, Loader2 } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@supabase/supabase-js";

interface NavLinksProps {
  isDataInput: boolean;
  isAdmin: boolean;
  user: UserType | null;
  onMobileClick?: () => void;
}

const NavLinks = ({ isDataInput, isAdmin, user, onMobileClick }: NavLinksProps) => {
  // If user is data input, show data input specific navigation
  if (isDataInput) {
    return (
      <>
        <Link 
          to="/data-input/webhook" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={onMobileClick}
        >
          Webhook Data
        </Link>
        <Link 
          to="/data-input/questions" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={onMobileClick}
        >
          Question Editor
        </Link>
        <Link 
          to="/data-input/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={onMobileClick}
        >
          Manage Questions
        </Link>
      </>
    );
  }

  // Regular user navigation
  return (
    <>
      {user && (
        <Link 
          to="/dashboard" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={onMobileClick}
        >
          Dashboard
        </Link>
      )}
      <Link 
        to="/lets-practice" 
        className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
        onClick={onMobileClick}
      >
        Let's Practice!
      </Link>
      <Link 
        to="/brain-training" 
        className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
        onClick={onMobileClick}
      >
        Brain Training Games
      </Link>
      <Link 
        to="/about" 
        className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
        onClick={onMobileClick}
      >
        About Us
      </Link>
      {isAdmin && (
        <Link 
          to="/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={onMobileClick}
        >
          Manage Questions
        </Link>
      )}
    </>
  );
};

const Navigation = () => {
  const { user, profile, signOut, isAdmin, isDataInput, authInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (location.pathname === "/auth") {
    return null;
  }

  if (!authInitialized) {
    return (
      <nav className="border-b bg-[#1EAEDB] shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <Link to="/" className="hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/fa3e7201-848d-4ab9-a19d-74319434852e.png" 
                alt="IQify Logo" 
                className="h-12 md:h-14"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
            </Link>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-[#1EAEDB] shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to={isDataInput ? "/data-input/webhook" : "/"} className="hover:scale-105 transition-transform">
            <img 
              src="/lovable-uploads/fa3e7201-848d-4ab9-a19d-74319434852e.png" 
              alt="IQify Logo" 
              className="h-12 md:h-14"
              onError={(e) => {
                e.currentTarget.src = '/logo.png';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks 
              isDataInput={isDataInput} 
              isAdmin={isAdmin} 
              user={user} 
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Auth/Profile Button */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                {!isDataInput && (
                  <Link to="/avatar-creator" className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-1 px-2 rounded">
                    <Avatar className="h-8 w-8">
                      {profile?.avatar_url ? (
                        <AvatarImage 
                          src={profile.avatar_url} 
                          alt="User avatar"
                        />
                      ) : (
                        <AvatarFallback className="bg-[#00FF7F] text-white">
                          {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium text-white">Character</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white hover:bg-white/20"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-white hover:bg-white/20"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              <NavLinks 
                isDataInput={isDataInput} 
                isAdmin={isAdmin} 
                user={user}
                onMobileClick={toggleMobileMenu}
              />
              {user ? (
                <div className="flex flex-col space-y-2">
                  {!isDataInput && (
                    <Link 
                      to="/avatar-creator" 
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
                      onClick={toggleMobileMenu}
                    >
                      <Avatar className="h-6 w-6">
                        {profile?.avatar_url ? (
                          <AvatarImage 
                            src={profile.avatar_url} 
                            alt="User avatar"
                          />
                        ) : (
                          <AvatarFallback className="bg-[#00FF7F] text-white text-xs">
                            {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span>Character</span>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-white hover:bg-white/20 justify-start"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="text-white hover:bg-white/20 justify-start"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
