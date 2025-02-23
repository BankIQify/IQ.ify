
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Navigation = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // For debugging
  useEffect(() => {
    console.log('Current auth state:', { user, isAdmin });
  }, [user, isAdmin]);

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
        className="block px-4 py-2 text-sm hover:bg-pastel-blue/20 rounded-md"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        to="/lets-practice" 
        className="block px-4 py-2 text-sm hover:bg-pastel-pink/20 rounded-md"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Let's Practice!
      </Link>
      <Link 
        to="/brain-training" 
        className="block px-4 py-2 text-sm hover:bg-pastel-yellow/20 rounded-md"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        Brain Training Games
      </Link>
      {isAdmin && (
        <Link 
          to="/manage-questions" 
          className="block px-4 py-2 text-sm hover:bg-pastel-yellow/20 rounded-md"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Manage Questions
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-gradient-to-r from-pastel-blue via-pastel-pink to-pastel-purple shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-education-600 hover:scale-105 transition-transform">
            <span className="bg-gradient-to-r from-education-600 to-education-800 bg-clip-text text-transparent">
              11+ Learning
            </span>
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

          {/* Auth Button */}
          <div className="hidden md:block">
            {user ? (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="hover:bg-pastel-purple/20 border-education-600"
              >
                Sign Out
              </Button>
            ) : (
              location.pathname !== "/auth" && (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="bg-education-600 hover:bg-education-700"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t animate-fade-in">
            <div className="py-2 space-y-1">
              <NavLinks />
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full mt-2 hover:bg-pastel-purple/20 border-education-600"
                >
                  Sign Out
                </Button>
              ) : (
                location.pathname !== "/auth" && (
                  <Button 
                    onClick={() => navigate("/auth")}
                    className="w-full mt-2 bg-education-600 hover:bg-education-700"
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
