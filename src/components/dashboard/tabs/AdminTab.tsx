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
  ShieldCheck, 
  ActivitySquare,
  FileText,
  LayoutDashboard,
  Shield,
  Activity,
  StickyNote,
  FileEdit,
  LineChart,
  List
} from "lucide-react";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminRolesManager } from "@/components/dashboard/admin/AdminRolesManager";
import { AdminActivityLog } from "@/components/dashboard/admin/AdminActivityLog";
import { ActivityDashboard } from "@/components/dashboard/admin/ActivityDashboard";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";
import { AboutUsManager } from "@/components/admin/AboutUsManager";
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
          Activity Monitoring
        </TabsTrigger>
        <TabsTrigger value="differentiators" className="flex items-center gap-2">
          <StickyNote className="w-4 h-4" />
          Differentiators
        </TabsTrigger>
        <TabsTrigger value="about" className="flex items-center gap-2">
          <FileEdit className="w-4 h-4" />
          About Us
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
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
              Activity Monitoring
            </CardTitle>
            <CardDescription>Monitor user activity and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Activity Dashboard
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Activity Logs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <ActivityDashboard />
              </TabsContent>
              <TabsContent value="logs">
                <AdminActivityLog />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="differentiators">
        <DifferentiatorManager />
      </TabsContent>

      <TabsContent value="about">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5" />
              About Us Content
            </CardTitle>
            <CardDescription>Manage the content displayed on the About Us page</CardDescription>
          </CardHeader>
          <CardContent>
            <AboutUsManager />
            <DifferentiatorManager />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
