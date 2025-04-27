import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "../../ErrorBoundary";
import { useEffect } from "react";

export const OverviewTabExplorer = ({ profile, loading = false }) => {
  console.log("DEBUG: OverviewTabExplorer profile:", profile);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || profile?.username || "CASCADE_DEBUG";

  return (
    <>
      <div style={{ background: 'blue', color: 'white', padding: '10px', marginBottom: '16px' }}>
        DEBUG: OverviewTabExplorer.tsx is rendering!
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2 flex items-center justify-center">
            <div className="p-6 bg-white rounded-lg shadow">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Welcome, {displayName}!</h3>
                <p className="text-muted-foreground">
                  Explore your progress and achievements. Pro means learning that adapts to your goals, not the other way around!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-2">Recent Activity</h4>
            {/* Could reuse <RecentActivity profile={profile} /> if not AI-powered */}
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h4 className="text-lg font-semibold mb-2">Achievements</h4>
            {/* Could reuse <AchievementsTab profile={profile} /> if not AI-powered */}
          </div>
        </div>
      </div>
    </>
  );
};
