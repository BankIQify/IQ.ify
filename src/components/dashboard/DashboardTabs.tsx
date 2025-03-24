
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText } from "lucide-react";

interface DashboardTabsProps {
  isAdmin: boolean;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardTabs = ({ isAdmin, activeTab, onTabChange }: DashboardTabsProps) => {
  const handleTabClick = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // For admin users, show admin tabs
  if (isAdmin) {
    return (
      <TabsList className="grid grid-cols-1 gap-2">
        <TabsTrigger 
          value="admin" 
          className="flex items-center gap-2"
          data-state={activeTab === "admin" ? "active" : "inactive"}
          onClick={() => handleTabClick("admin")}
        >
          <Settings className="h-4 w-4" />
          <span>Admin</span>
        </TabsTrigger>
      </TabsList>
    );
  }

  // For non-admin users, don't render any tabs (this component won't be used anyway after our Dashboard changes)
  return null;
};
