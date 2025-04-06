import { useState, useEffect } from "react";
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import {
  Loader2,
  Search,
  Filter,
  Calendar,
  User,
  Shield,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  activity_details: any;
  created_at: string;
  success: boolean;
  severity: 'info' | 'warning' | 'error' | 'success';
}

interface UserSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  ip_address: string;
  user_agent: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  last_sign_in: string;
  subscription_status: string;
  subscription_tier: string;
  created_at: string;
}

export const UserActivityMonitor = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const { toast } = useToast();

  // Fetch users and their roles
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles(role)
        `);

      if (error) throw error;

      const processedUsers = profiles.map((profile: any) => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name || 'No Name',
        role: profile.user_roles?.[0]?.role || 'user',
        last_sign_in: profile.last_sign_in_at,
        subscription_status: profile.subscription_status,
        subscription_tier: profile.subscription_tier,
        created_at: profile.created_at,
      }));

      setUsers(processedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user activities and sessions
  const fetchUserDetails = async (userId: string) => {
    try {
      const [activitiesResponse, sessionsResponse] = await Promise.all([
        supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        supabase
          .from('user_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('started_at', { ascending: false }),
      ]);

      if (activitiesResponse.error) throw activitiesResponse.error;
      if (sessionsResponse.error) throw sessionsResponse.error;

      setActivities(activitiesResponse.data || []);
      setSessions(sessionsResponse.data || []);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
    fetchUserDetails(user.id);
  };

  const getSeverityIcon = (severity: 'info' | 'warning' | 'error' | 'success') => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.full_name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    user.subscription_status === 'active' ? 'default' :
                    user.subscription_status === 'trialing' ? 'secondary' :
                    'destructive'
                  }>
                    {user.subscription_status || 'inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.last_sign_in
                    ? formatDistanceToNow(new Date(user.last_sign_in), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUserClick(user)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="sessions" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Sessions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Profile Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Full Name</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedUser.full_name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedUser.email}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Role</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedUser.role}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Member Since</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(selectedUser.created_at), 'PPP')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Subscription Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Status</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedUser.subscription_status || 'No subscription'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Tier</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedUser.subscription_tier || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Select value={activityFilter} onValueChange={setActivityFilter}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activities</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="content">Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(activity.created_at), 'PPp')}
                          </TableCell>
                          <TableCell>{activity.activity_type}</TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {JSON.stringify(activity.activity_details)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={activity.success ? 'default' : 'destructive'}>
                              {activity.success ? 'Success' : 'Failed'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="sessions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {format(new Date(session.started_at), 'PPp')}
                        </TableCell>
                        <TableCell>
                          {session.duration_minutes
                            ? `${Math.round(session.duration_minutes)} minutes`
                            : 'Active'}
                        </TableCell>
                        <TableCell>{session.ip_address}</TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {session.user_agent}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 