import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, BarChart, TrendingUp, Award } from "lucide-react";

interface DashboardTabsProps {
  isAdmin: boolean;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardTabs = ({ isAdmin, activeTab, onTabChange }: DashboardTabsProps) => {
  // For admin users, show admin tabs
  if (isAdmin) {
    return (
      <TabsList className="grid grid-cols-1 gap-2">
        <TabsTrigger 
          value="admin" 
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>Admin</span>
        </TabsTrigger>
      </TabsList>
    );
  }

  // For regular users, show user dashboard tabs
  return (
    <TabsList className="grid grid-cols-3 gap-2">
      <TabsTrigger 
        value="overview" 
        className="flex items-center gap-2"
      >
        <BarChart className="h-4 w-4" />
        <span>Overview</span>
      </TabsTrigger>
      <TabsTrigger 
        value="progress" 
        className="flex items-center gap-2"
      >
        <TrendingUp className="h-4 w-4" />
        <span>Progress</span>
      </TabsTrigger>
      <TabsTrigger 
        value="achievements" 
        className="flex items-center gap-2"
      >
        <Award className="h-4 w-4" />
        <span>Achievements</span>
      </TabsTrigger>
    </TabsList>
  );
};
