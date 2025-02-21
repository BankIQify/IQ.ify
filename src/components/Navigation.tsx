
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const isAdmin = user?.email === "admin@example.com"; // Replace with your admin email

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="border-b bg-gradient-to-r from-pastel-blue via-pastel-pink to-pastel-purple shadow-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-education-600 hover:scale-105 transition-transform">
          <span className="bg-gradient-to-r from-education-600 to-education-800 bg-clip-text text-transparent">
            11+ Learning
          </span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-4">
            <NavigationMenuItem>
              <Link 
                to="/dashboard" 
                className={`${navigationMenuTriggerStyle()} hover:bg-pastel-blue/20`}
              >
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/lets-practice" 
                className={`${navigationMenuTriggerStyle()} hover:bg-pastel-pink/20`}
              >
                Let's Practice!
              </Link>
            </NavigationMenuItem>
            {isAdmin && (
              <NavigationMenuItem>
                <Link 
                  to="/manage-questions" 
                  className={`${navigationMenuTriggerStyle()} hover:bg-pastel-yellow/20`}
                >
                  Manage Questions
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div>
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
    </nav>
  );
};

export default Navigation;
