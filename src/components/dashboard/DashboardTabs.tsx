
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BarChart3, ChartLine, Settings, User } from "lucide-react";

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

  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <TabsTrigger 
        value="overview" 
        className="flex items-center gap-2"
        data-state={activeTab === "overview" ? "active" : "inactive"}
        onClick={() => handleTabClick("overview")}
      >
        <BarChart3 className="h-4 w-4" />
        <span>Overview</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="progress" 
        className="flex items-center gap-2"
        data-state={activeTab === "progress" ? "active" : "inactive"}
        onClick={() => handleTabClick("progress")}
      >
        <ChartLine className="h-4 w-4" />
        <span>Progress</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="achievements" 
        className="flex items-center gap-2"
        data-state={activeTab === "achievements" ? "active" : "inactive"}
        onClick={() => handleTabClick("achievements")}
      >
        <Award className="h-4 w-4" />
        <span>Achievements</span>
      </TabsTrigger>
      
      {isAdmin && (
        <TabsTrigger 
          value="admin" 
          className="flex items-center gap-2"
          data-state={activeTab === "admin" ? "active" : "inactive"}
          onClick={() => handleTabClick("admin")}
        >
          <Settings className="h-4 w-4" />
          <span>Admin</span>
        </TabsTrigger>
      )}
    </TabsList>
  );
};
