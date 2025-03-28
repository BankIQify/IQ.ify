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
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <Link to="/" className="hover:scale-105 transition-transform">
              <img 
                src="/lovable-uploads/fa3e7201-848d-4ab9-a19d-74319434852e.png" 
                alt="iQify Logo" 
                className="h-12 md:h-14"
              />
            </Link>
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
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
          className="block px-4 py-2 text-sm hover:bg-slate-50 rounded-md font-medium text-slate-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      )}
      <Link 
        to="/lets-practice" 
        className="block px-4 py-2 text-sm hover:bg-slate-50 rounded-md font-medium text-slate-700"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Let's Practice!
      </Link>
      <Link 
        to="/brain-training" 
        className="block px-4 py-2 text-sm hover:bg-slate-50 rounded-md font-medium text-slate-700"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Brain Training Games
      </Link>
      {!checkingRoles && (isAdmin || hasDataInputRole) && (
        <Link 
          to="/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-slate-50 rounded-md font-medium text-slate-700"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Manage Questions
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-white shadow-sm">
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
              <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link to="/avatar-creator" className="flex items-center gap-2 hover:bg-slate-50 py-1 px-2 rounded">
                  <Avatar className="h-8 w-8">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-slate-100 text-slate-700">
                        {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm font-medium text-slate-700">
                    Character
                  </span>
                </Link>
                <Link to="/profile">
                  <Button 
                    variant="outline"
                    className="hover:bg-slate-50 border-slate-200 text-slate-700"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="hover:bg-slate-50 border-slate-200 text-slate-700"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              location.pathname !== "/auth" && (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-slate-800 hover:bg-slate-900 text-white"
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
                <>
                  <Link 
                    to="/avatar-creator" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-slate-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2 text-slate-600" />
                    Character Creation
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-2 text-sm hover:bg-slate-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2 text-slate-600" />
                    Profile Settings
                  </Link>
                </>
              )}
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full mt-2 hover:bg-slate-50 border-slate-200 text-slate-700"
                >
                  Sign Out
                </Button>
              ) : (
                location.pathname !== "/auth" && (
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white"
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
