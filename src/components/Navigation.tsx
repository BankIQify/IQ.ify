import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon, User, Settings, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const { user, profile, signOut, isAdmin, authInitialized } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasDataInputRole, setHasDataInputRole] = useState(false);
  const [checkingRoles, setCheckingRoles] = useState(true);

  // For debugging
  useEffect(() => {
    console.log('Navigation component: Current auth state:', { 
      user: user?.id, 
      isAdmin, 
      profile: profile?.id, 
      authInitialized,
      currentPath: location.pathname
    });
  }, [user, isAdmin, profile, authInitialized, location.pathname]);

  // Check for data_input role
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) {
        setHasDataInputRole(false);
        setCheckingRoles(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        if (error) {
          console.error('Error checking data_input role:', error);
        }

        setHasDataInputRole(!!data);
      } catch (error) {
        console.error('Error in checkDataInputRole:', error);
      } finally {
        setCheckingRoles(false);
      }
    };

    if (authInitialized && user) {
      checkDataInputRole();
    } else if (authInitialized) {
      setCheckingRoles(false);
    }
  }, [user, authInitialized]);

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

  if (!authInitialized) {
    return (
      <nav className="border-b bg-[#1EAEDB] shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <Link to="/" className="hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/fa3e7201-848d-4ab9-a19d-74319434852e.png" 
                alt="iQify Logo" 
                className="h-12 md:h-14"
              />
            </Link>
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        </div>
      </nav>
    );
  }

  const NavLinks = () => (
    <>
      {user && (
        <Link 
          to="/dashboard" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      <Link 
        to="/lets-practice" 
        className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Let's Practice!
      </Link>
      <Link 
        to="/brain-training" 
        className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Brain Training Games
      </Link>
      {!checkingRoles && (isAdmin || hasDataInputRole) && (
        <Link 
          to="/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-white/20 rounded-md font-medium text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Manage Questions
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-[#1EAEDB] shadow-sm">
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
            {checkingRoles ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link to="/avatar-creator" className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-1 px-2 rounded">
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
                    Character
                  </span>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant="outline"
                    className="hover:bg-[rgba(0,255,127,0.2)] border-[#00FF7F] text-[#001F3F]"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-[rgba(0,255,127,0.2)] border-[#00FF7F] text-[#001F3F]"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button 
                  variant="outline"
                  className="hover:bg-[rgba(0,255,127,0.2)] border-[#00FF7F] text-[#001F3F]"
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <NavLinks />
            {user ? (
              <div className="mt-4 space-y-2 px-4">
                <Link 
                  to="/avatar-creator"
                  className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-2 px-3 rounded text-[#001F3F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Avatar className="h-6 w-6">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-[#00FF7F] text-white">
                        {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium">Character</span>
                </Link>
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-2 px-3 rounded text-[#001F3F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-2 px-3 rounded text-[#001F3F] w-full text-left"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 px-4">
                <Link 
                  to="/auth"
                  className="flex items-center gap-2 hover:bg-[rgba(30,174,219,0.2)] py-2 px-3 rounded text-[#001F3F]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
