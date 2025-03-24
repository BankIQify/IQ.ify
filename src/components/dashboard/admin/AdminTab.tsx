
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

export const AdminTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Roles & Permissions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <ActivitySquare className="h-4 w-4" />
            <span>Activity Logs</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/manage-questions">
                      <PieChart className="h-4 w-4 mr-2" />
                      Question Management
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/manage-questions?tab=webhooks">
                      <FileText className="h-4 w-4 mr-2" />
                      AI Webhooks
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/manage-questions?tab=puzzles">
                      <Brain className="h-4 w-4 mr-2" />
                      Puzzle Management
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/manage-questions?tab=homepage">
                      <Award className="h-4 w-4 mr-2" />
                      Update Homepage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <span>Total Users</span>
                    </div>
                    <span className="font-bold text-xl">1,254</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-red-500" />
                      <span>Admin Users</span>
                    </div>
                    <span className="font-bold text-xl">3</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amber-500" />
                      <span>Data Input Team</span>
                    </div>
                    <span className="font-bold text-xl">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
      </Tabs>
    </div>
  );
};
