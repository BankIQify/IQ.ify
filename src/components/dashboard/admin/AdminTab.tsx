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
  Activity, 
  FileText,
  PiSquare,
  TrendingUp
} from "lucide-react";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminActivityLog } from "@/components/dashboard/admin/AdminActivityLog";
import { AdminSettings } from "./AdminSettings";
import { AdminDashboard } from "./AdminDashboard";
import { DataInputMonitoring } from "@/components/dashboard/data-input/DataInputMonitoring";
import { HighlightsManager } from "@/components/dashboard/admin/HighlightsManager";

export const AdminTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <PiSquare className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Input Monitoring
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity Monitoring
          </TabsTrigger>
          <TabsTrigger value="highlights" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Highlights from HQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Overview
              </CardTitle>
              <CardDescription>System metrics and recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Users Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground mt-2">Total users</p>
                  </CardContent>
                </Card>

                {/* Active Users Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Brain className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">852</div>
                    <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
                  </CardContent>
                </Card>

                {/* Growth Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+15%</div>
                    <p className="text-xs text-muted-foreground mt-2">Since last month</p>
                  </CardContent>
                </Card>
              </div>
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
    </div>
  );
};
