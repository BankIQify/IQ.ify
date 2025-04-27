import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SplitPaneLayoutProps {
  userId: string | null;
  onUserSelect: (userId: string) => void;
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

export const SplitPaneLayout = ({ userId, onUserSelect }: SplitPaneLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<UserActivity[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setUser(profile);

      // Fetch activity logs
      const { data: logs, error: logsError } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(50); // Limit to 50 recent activities

      if (logsError) throw logsError;
      setActivityLogs(logs || []);

      // Fetch subscription details
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

  if (loading && userId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a user to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{user.name || user.username || user.email.split("@")[0]}</h1>
          <p className="text-sm text-muted-foreground">User ID: {userId}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
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
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
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
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sign-up History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Registration Date:</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(user.created_at), "PPP")}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Referral Source:</h3>
                  <p className="text-muted-foreground">{user.referral_source || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Device Information:</h3>
                  <p className="text-muted-foreground">{user.device_info || "Not available"}</p>
                </div>
                <div>
                  <h3 className="font-medium">IP Address:</h3>
                  <p className="text-muted-foreground">{user.ip_address || "Not available"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
