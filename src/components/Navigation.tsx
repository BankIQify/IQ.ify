
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Brain, LayoutDashboard, Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Practice",
      path: "/practice",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Brain Training",
      path: "/brain-training",
      icon: <Brain className="w-5 h-5" />,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-education-600 font-bold text-xl"
          >
            <BookOpen className="w-6 h-6" />
            <span>11+ Prep</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 text-gray-600 hover:text-education-600 transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="ml-4"
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="ml-4">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-education-600 hover:bg-gray-100"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-slideIn">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-education-600"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            {user ? (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full mt-4"
              >
                Sign Out
              </Button>
            ) : (
              <Link to="/auth" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full mt-4">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
