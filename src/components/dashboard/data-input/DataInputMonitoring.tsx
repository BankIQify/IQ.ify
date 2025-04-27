import { Card } from "@/components/ui/card";
import { ShieldCheck, FileText, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const DataInputMonitoring = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Webhook Data */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Recent Webhook Data</h3>
              <p className="text-sm text-muted-foreground">
                Monitor incoming data from webhooks
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Real-time</Badge>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Last Update</p>
                <p className="text-lg font-bold">3 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Live</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-lg font-bold">5 Items</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+12%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Input Stats */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Data Input Statistics</h3>
              <p className="text-sm text-muted-foreground">
                Track your data input performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-lg font-bold">1,245</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+15%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-lg font-bold">92%</p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">High</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
