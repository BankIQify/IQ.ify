import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UserDetailModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface UserActivity {
  action: string;
  timestamp: string;
  details: {
    [key: string]: any;
  };
}

interface UserSubscription {
  status: string;
  plan: string;
  start_date: string;
  end_date: string;
  payment_method: string;
}

export const UserDetailModal = ({ userId, isOpen, onClose }: UserDetailModalProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<UserActivity[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setUser(profile);

      // Fetch activity logs (you might need to adjust this query based on your actual activity logs table)
      const { data: logs, error: logsError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (logsError) throw logsError;
      setActivityLogs(logs || []);

      // Fetch subscription details (adjust this based on your actual subscription table)
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false })
        .single();

      if (subError && subError.code !== 'PGRST116') { // Not found error
        throw subError;
      }
      setSubscription(sub || null);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Loading User Details...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Name:</h3>
                  <p className="text-muted-foreground">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email:</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <h3 className="font-medium">Username:</h3>
                  <p className="text-muted-foreground">{user.username || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Joined:</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(user.created_at), "PPP")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Last Login:</h3>
                  <p className="text-muted-foreground">
                    {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "PPP") : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(log.timestamp), "HH:mm - d MMM yyyy")}
                    </div>
                    <div className="font-medium">{log.action}</div>
                    {Object.entries(log.details).length > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        <ul className="list-disc list-inside">
                          {Object.entries(log.details).map(([key, value]) => (
                            <li key={key}>{key}: {String(value)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Status:</h3>
                    <p className="text-muted-foreground">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscription.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : subscription.status === "trial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}>
                        {subscription.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Plan:</h3>
                    <p className="text-muted-foreground">{subscription.plan}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Period:</h3>
                    <p className="text-muted-foreground">
                      {format(new Date(subscription.start_date), "PPP")} -
                      {format(new Date(subscription.end_date), "PPP")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Payment Method:</h3>
                    <p className="text-muted-foreground">{subscription.payment_method}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No subscription information available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
