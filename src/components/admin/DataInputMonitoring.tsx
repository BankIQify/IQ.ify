import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: {
    questionsAdded?: number;
    subtopics?: string[];
  };
}

interface UserStats {
  userId: string;
  name: string;
  totalQuestions: number;
  activeSubtopics: string[];
  lastActive: string;
}

const DataInputMonitoring = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);

  useEffect(() => {
    fetchActivityLogs();
    fetchUserStats();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      // This would be replaced with actual API call
      const mockLogs = [
        {
          id: "1",
          userId: "user1",
          action: "login",
          timestamp: "2025-04-24T18:00:00",
          details: {}
        },
        {
          id: "2",
          userId: "user1",
          action: "add_questions",
          timestamp: "2025-04-24T18:15:00",
          details: {
            questionsAdded: 15,
            subtopics: ["Mathematics - Algebra", "Mathematics - Geometry"]
          }
        },
        // ... more mock logs
      ];
      setActivityLogs(mockLogs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // This would be replaced with actual API call
      const mockStats = [
        {
          userId: "user1",
          name: "Data Input Team",
          totalQuestions: 125,
          activeSubtopics: ["Mathematics - Algebra", "Mathematics - Geometry", "Physics - Mechanics"],
          lastActive: "2025-04-24T18:15:00"
        },
        // ... more mock stats
      ];
      setUserStats(mockStats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user statistics",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions performed by data input team</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(new Date(log.timestamp), 'HH:mm - d MMM')}</TableCell>
                  <TableCell>Data Input Team</TableCell>
                  <TableCell>
                    <Badge variant={log.action === "login" ? "outline" : "default"}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.details.questionsAdded ? (
                      <div className="space-y-1">
                        <div>{log.details.questionsAdded} questions added</div>
                        <div className="text-sm text-muted-foreground">
                          {log.details.subtopics?.join(", ")}
                        </div>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Performance</CardTitle>
          <CardDescription>Questions added by subtopic</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subtopic</TableHead>
                <TableHead>Questions Added</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userStats.flatMap((user) =>
                user.activeSubtopics.map((subtopic) => (
                  <TableRow key={subtopic}>
                    <TableCell>{subtopic}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {Math.floor(Math.random() * 50) + 10} questions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.lastActive), 'HH:mm - d MMM')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export { DataInputMonitoring };
