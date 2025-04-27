import { Card } from "@/components/ui/card";
import { ShieldCheck, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DataInputDashboard = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <StickyNote className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Data Input Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Manage and monitor data input activities
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Subtopics Grid */}
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Subtopics</p>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Mathematics</p>
                    <p className="text-lg font-bold">45 Questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/data-input/mathematics">View</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Verbal Reasoning</p>
                    <p className="text-lg font-bold">32 Questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/data-input/verbal">View</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="text-sm text-muted-foreground">Non-Verbal Reasoning</p>
                    <p className="text-lg font-bold">28 Questions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/data-input/nonverbal">View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Quick Actions</p>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <Link to="/admin/data-input/manual">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Manual Input
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/data-input/webhook">
                    <StickyNote className="mr-2 h-4 w-4" />
                    Webhook Data
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Last Update</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                  <div className="text-xs text-muted-foreground">+12 Questions</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pending Reviews</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <div className="text-xs text-muted-foreground">5 Items</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
