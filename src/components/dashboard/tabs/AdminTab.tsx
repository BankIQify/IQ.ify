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
  Activity,
  FileText,
  LayoutDashboard,
  ActivitySquare,
  StickyNote,
  FileEdit,
  LineChart,
  List,
  PiSquare
} from "lucide-react";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminRolesManager } from "@/components/dashboard/admin/AdminRolesManager";
import { AdminActivityLog } from "@/components/dashboard/admin/AdminActivityLog";
import { ActivityDashboard } from "@/components/dashboard/admin/ActivityDashboard";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";
import { HighlightsManager } from "@/components/dashboard/admin/HighlightsManager";
import { DataInputMonitoring } from "@/components/dashboard/data-input/DataInputMonitoring";

export const AdminTab = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="users" className="flex items-center gap-2">
          <PiSquare className="w-4 h-4" />
          User Management
        </TabsTrigger>
        <TabsTrigger value="monitor" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Data Input Monitoring
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Activity Monitoring
        </TabsTrigger>
        <TabsTrigger value="highlights" className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Highlights from HQ
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
              <PiSquare className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUsersList />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="monitor">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Input Monitoring
            </CardTitle>
            <CardDescription>Monitor data input activities and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <DataInputMonitoring />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Monitoring
            </CardTitle>
            <CardDescription>View system-wide activity logs</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminActivityLog />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="highlights">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Highlights from HQ
            </CardTitle>
            <CardDescription>Manage and update platform highlights</CardDescription>
          </CardHeader>
          <CardContent>
            <HighlightsManager />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
