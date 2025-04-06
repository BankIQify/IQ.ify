import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  Brain,
  FileText,
  Award,
  User,
  ShieldCheck,
  BarChart,
  TrendingUp,
  Clock,
  UserCheck,
  Calendar,
  BookOpen,
  Home,
  Info
} from "lucide-react";

export const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Currently Active</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>Live count</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">New Users</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-bold">12</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Week</p>
                <p className="text-lg font-bold">84</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Month</p>
                <p className="text-lg font-bold">256</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">Questions by Category</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Verbal</p>
                <p className="text-lg font-bold">145</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Non-Verbal</p>
                <p className="text-lg font-bold">132</p>
              </div>
              <div className="bg-muted p-2 rounded-md">
                <p className="text-xs text-muted-foreground">Brain</p>
                <p className="text-lg font-bold">98</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pro Users</p>
              <h3 className="text-2xl font-bold">324</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">8%</span>
            <span className="ml-1">conversion rate</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/manage-content?tab=homepage">
                <Home className="h-4 w-4 mr-2" />
                Edit Homepage
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/manage-content?tab=about">
                <Info className="h-4 w-4 mr-2" />
                Edit About Us
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/manage-questions">
                <Brain className="h-4 w-4 mr-2" />
                Question Management
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/manage-content?tab=webhooks">
                <FileText className="h-4 w-4 mr-2" />
                AI Webhooks
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>API Response Time</span>
              </div>
              <span className="font-medium text-green-500">120ms</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-amber-500" />
                <span>Database Status</span>
              </div>
              <span className="font-medium text-green-500">Healthy</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <span>Security Status</span>
              </div>
              <span className="font-medium text-green-500">Protected</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 