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
  FileText,
  Presentation,
  Layout,
  LayoutDashboard,
  Shield,
  Activity,
  StickyNote
} from "lucide-react";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminRolesManager } from "@/components/dashboard/admin/AdminRolesManager";
import { AdminActivityLog } from "@/components/dashboard/admin/AdminActivityLog";
import { StatsManager } from "@/components/admin/StatsManager";
import { HomepageManager } from "@/components/admin/HomepageManager";
import { TestimonialManager } from "@/components/admin/TestimonialManager";
import { Overview } from "@/components/admin/Overview";
import { UserManagement } from "@/components/admin/UserManagement";
import { RolesPermissions } from "@/components/admin/RolesPermissions";
import { ActivityLogs } from "@/components/admin/ActivityLogs";
import { DifferentiatorManager } from "@/components/admin/DifferentiatorManager";

export const AdminTab = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          User Management
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Roles & Permissions
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Activity Logs
        </TabsTrigger>
        <TabsTrigger value="differentiators" className="flex items-center gap-2">
          <StickyNote className="w-4 h-4" />
          Differentiators
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Site Statistics
            </CardTitle>
            <CardDescription>Overview of platform usage and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminStats />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts, roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUsersList />
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

      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivitySquare className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>Monitor user activity and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminActivityLog />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="differentiators">
        <DifferentiatorManager />
      </TabsContent>
    </Tabs>
  );
};
