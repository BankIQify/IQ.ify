
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdmin = user?.email === "admin@example.com"; // Replace with your admin email

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      <NavigationMenuItem>
        <Link 
          to="/dashboard" 
          className={`${navigationMenuTriggerStyle()} hover:bg-pastel-blue/20`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link 
          to="/lets-practice" 
          className={`${navigationMenuTriggerStyle()} hover:bg-pastel-pink/20`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Let's Practice!
        </Link>
      </NavigationMenuItem>
      {isAdmin && (
        <NavigationMenuItem>
          <Link 
            to="/manage-questions" 
            className={`${navigationMenuTriggerStyle()} hover:bg-pastel-yellow/20`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Manage Questions
          </Link>
        </NavigationMenuItem>
      )}
    </>
  );

  return (
    <nav className="border-b bg-gradient-to-r from-pastel-blue via-pastel-pink to-pastel-purple shadow-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-education-600 hover:scale-105 transition-transform">
          <span className="bg-gradient-to-r from-education-600 to-education-800 bg-clip-text text-transparent">
            11+ Learning
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-4">
            <NavLinks />
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
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
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <NavigationMenuList className="flex flex-col space-y-2">
              <NavLinks />
            </NavigationMenuList>
            {user ? (
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full hover:bg-pastel-purple/20 border-education-600"
              >
                Sign Out
              </Button>
            ) : (
              location.pathname !== "/auth" && (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="w-full bg-education-600 hover:bg-education-700"
                >
                  Sign In
                </Button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
