import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const DataInputSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    {
      name: "Question Editor",
      href: "/data-input/questions",
    },
    {
      name: "Manage Questions",
      href: "/data-input/manage-questions",
    },
    {
      name: "Webhook Data",
      href: "/data-input/webhook",
    }
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <img src="/logo.png" alt="IQify Logo" className="h-8" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md",
              location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-primary/5"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="flex-shrink-0 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}; 