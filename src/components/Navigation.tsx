
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-education-600">
          11+ Learning
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-4">
            <NavigationMenuItem>
              <Link to="/dashboard" className={navigationMenuTriggerStyle()}>
                Dashboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/practice" className={navigationMenuTriggerStyle()}>
                Practice
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/brain-training" className={navigationMenuTriggerStyle()}>
                Brain Training
              </Link>
            </NavigationMenuItem>
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/manage-questions" className={navigationMenuTriggerStyle()}>
                    Manage Questions
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/manage-exams" className={navigationMenuTriggerStyle()}>
                    Manage Exams
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div>
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            location.pathname !== "/auth" && (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

