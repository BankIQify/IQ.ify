import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Brain, 
  Award, 
  Users, 
  Settings, 
  PieChart, 
  User, 
  ShieldCheck, 
  ActivitySquare,
  FileText
} from "lucide-react";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminRolesManager } from "@/components/dashboard/admin/AdminRolesManager";
import { AdminActivityLog } from "@/components/dashboard/admin/AdminActivityLog";
import { AdminSettings } from "./AdminSettings";
import { AdminDashboard } from "./AdminDashboard";
import { UserActivityMonitor } from "./UserActivityMonitor";

export const AdminTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>Overview of system metrics and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management & Activity
              </CardTitle>
              <CardDescription>Manage users and monitor their activity</CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivityMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
              <CardDescription>Manage user roles and associated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminRolesManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Settings
              </CardTitle>
              <CardDescription>Configure admin panel settings</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
