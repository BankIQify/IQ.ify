import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicQuickActions } from "./DynamicQuickActions";
import { LearningRecommendations } from "./LearningRecommendations";
import { WeakSubtopics } from "./WeakSubtopics";
import { UserLogs } from "@/components/admin/UserLogs";
import { useAuth } from "@/hooks/useAuth";
import { AchievementsTab } from "./tabs/AchievementsTab";
import { ErrorBoundary } from "../ErrorBoundary";
import { useEffect } from "react";

export const Dashboard = () => {
  const { isAdmin } = useAuth();

  useEffect(() => {
    console.log('Dashboard mounted');
    
    // Log any unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('Unhandled error:', event.error);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  console.log('Dashboard rendering with isAdmin:', isAdmin);

  return (
    <ErrorBoundary>
      <div className="space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin">Admin</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <ErrorBoundary>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <DynamicQuickActions />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <LearningRecommendations className="col-span-4" />
                <WeakSubtopics className="col-span-3" />
              </div>
            </ErrorBoundary>
          </TabsContent>
          <TabsContent value="achievements">
            <ErrorBoundary>
              <AchievementsTab />
            </ErrorBoundary>
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin" className="space-y-4">
              <ErrorBoundary>
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserLogs />
                  </CardContent>
                </Card>
              </ErrorBoundary>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}; 