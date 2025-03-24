
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const { user, profile, signOut, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For debugging
  useEffect(() => {
    console.log('Current auth state:', { user, isAdmin, profile });
  }, [user, isAdmin, profile]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      <Link 
        to="/dashboard" 
        className="block px-4 py-2 text-sm hover:bg-[rgba(30,174,219,0.2)] rounded-md font-medium text-[#001F3F]"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        to="/lets-practice" 
        className="block px-4 py-2 text-sm hover:bg-[rgba(255,105,180,0.2)] rounded-md font-medium text-[#001F3F]"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Let's Practice!
      </Link>
      <Link 
        to="/brain-training" 
        className="block px-4 py-2 text-sm hover:bg-[rgba(255,215,0,0.2)] rounded-md font-medium text-[#001F3F]"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Brain Training Games
      </Link>
      {isAdmin && (
        <Link 
          to="/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-[rgba(0,255,127,0.2)] rounded-md font-medium text-[#001F3F]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Manage Questions
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-gradient-to-r from-[#1EAEDB] via-[#FFD700] to-[#FF69B4] shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="hover:scale-105 transition-transform">
            <img 
              src="/lovable-uploads/fa3e7201-848d-4ab9-a19d-74319434852e.png" 
              alt="iQify Logo" 
              className="h-12 md:h-14"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
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
                <Link to="/profile" className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-1 px-2 rounded">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-[#00FF7F] text-white">
                        {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">
                    {profile?.username || profile?.name || "Profile"}
                  </span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-[rgba(255,105,180,0.2)] border-[#FF69B4] text-[#001F3F]"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              location.pathname !== "/auth" && (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-[#00FF7F] hover:bg-opacity-80 text-white"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-fadeIn">
            <div className="py-2 space-y-1">
              <NavLinks />
              {user && (
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 text-sm hover:bg-[rgba(139,92,246,0.2)] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              )}
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full mt-2 hover:bg-[rgba(255,105,180,0.2)] border-[#FF69B4] text-[#001F3F]"
                >
                  Sign Out
                </Button>
              ) : (
                location.pathname !== "/auth" && (
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="w-full mt-2 bg-[#00FF7F] hover:bg-opacity-80 text-white"
                  >
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
