import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { Loader2, ChevronDown, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserLog {
  id: string;
  full_name: string;
  email: string;
  role: string;
  last_sign_in: string;
  last_session_duration: number;
}

interface UserDetails {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  subscription_tier: string | null;
  subscription_status: string | null;
  sessions: {
    daily: SessionSummary[];
    weekly: SessionSummary[];
    monthly: SessionSummary[];
    total: SessionSummary[];
  };
}

interface SessionSummary {
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
}

export const UserLogs = () => {
  const [users, setUsers] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserLog | null>(null);
  const [userType, setUserType] = useState<"all" | "admin" | "user">("all");
  const { toast } = useToast();

  // Fetch user logs
  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      console.log('Fetching user logs...');
      
      // First get all profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles(role)
        `);

      if (profilesError) {
        console.error('Profile fetch error:', profilesError);
        throw profilesError;
      }

      console.log('Fetched profiles:', profiles);

      // Get sessions separately to avoid join issues
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*');

      if (sessionsError) {
        console.error('Sessions fetch error:', sessionsError);
        throw sessionsError;
      }

      console.log('Fetched sessions:', sessions);

      // Process the data
      const processedLogs = profiles?.map((profile: any) => {
        const userSessions = sessions?.filter(s => s.user_id === profile.id) || [];
        const lastSession = userSessions[0];

        return {
          id: profile.id,
          full_name: profile.full_name || 'No Name',
          email: profile.email || 'No Email',
          role: profile.user_roles?.[0]?.role || 'user',
          last_sign_in: profile.last_sign_in_at,
          last_session_duration: lastSession?.duration_minutes || 0
        };
      }) || [];

      console.log('Processed logs:', processedLogs);
      setUsers(processedLogs);
    } catch (error) {
      console.error('Error fetching user logs:', error);
      toast({
        title: "Error fetching users",
        description: "There was a problem loading the user logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed user information
  const fetchUserDetails = async (userId: string) => {
    try {
      console.log('Fetching details for user:', userId);

      // Fetch user profile with roles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles:user_roles(role)
        `)
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile detail fetch error:', profileError);
        throw profileError;
      }

      console.log('Fetched profile details:', profile);

      // Fetch user sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false });

      if (sessionsError) {
        console.error('Sessions fetch error:', sessionsError);
        throw sessionsError;
      }

      console.log('Fetched sessions:', sessions);

      // Group sessions by time range
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const userDetails: UserDetails = {
        id: profile.id,
        full_name: profile.full_name || 'No Name',
        email: profile.email || 'No Email',
        created_at: profile.created_at,
        subscription_tier: profile.subscription_tier,
        subscription_status: profile.subscription_status,
        sessions: {
          daily: sessions?.filter(s => new Date(s.started_at) >= dayAgo) || [],
          weekly: sessions?.filter(s => new Date(s.started_at) >= weekAgo) || [],
          monthly: sessions?.filter(s => new Date(s.started_at) >= monthAgo) || [],
          total: sessions || []
        }
      };

      console.log('Processed user details:', userDetails);
      setSelectedUser(userDetails);
      setShowUserDetails(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast({
        title: "Error fetching user details",
        description: "There was a problem loading the user details.",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log('Attempting to delete user:', userId);

      // First check if user exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile check error:', profileError);
        throw profileError;
      }

      // Delete the user's sessions first
      const { error: deleteSessionsError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', userId);

      if (deleteSessionsError) {
        console.error('Sessions deletion error:', deleteSessionsError);
        throw deleteSessionsError;
      }

      // Delete the user's roles
      const { error: deleteRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteRolesError) {
        console.error('Roles deletion error:', deleteRolesError);
        throw deleteRolesError;
      }

      // Delete the user's profile
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteProfileError) {
        console.error('Profile deletion error:', deleteProfileError);
        throw deleteProfileError;
      }

      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setUserToDelete(null);
      setShowDeleteConfirm(false);

      toast({
        title: "User deleted successfully",
        description: "The user has been permanently removed from the system.",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: "There was a problem deleting the user. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  const filteredUsers = users.filter(user => {
    if (userType === "all") return true;
    if (userType === "admin") return user.role === "admin";
    return user.role === "user";
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button
            variant={userType === "all" ? "default" : "outline"}
            onClick={() => setUserType("all")}
          >
            All Users
          </Button>
          <Button
            variant={userType === "admin" ? "default" : "outline"}
            onClick={() => setUserType("admin")}
          >
            Admins
          </Button>
          <Button
            variant={userType === "user" ? "default" : "outline"}
            onClick={() => setUserType("user")}
          >
            Users
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Session Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {user.role}
                  </span>
                </TableCell>
                <TableCell>
                  {user.last_sign_in
                    ? formatDistanceToNow(new Date(user.last_sign_in), { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell>
                  {user.last_session_duration
                    ? `${Math.round(user.last_session_duration)} minutes`
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchUserDetails(user.id)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserToDelete(user);
                      setShowDeleteConfirm(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Basic Information</h3>
                  <div className="space-y-2 mt-2">
                    <p><span className="text-muted-foreground">Name:</span> {selectedUser.full_name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                    <p><span className="text-muted-foreground">Member Since:</span> {format(new Date(selectedUser.created_at), 'PPP')}</p>
                    <p><span className="text-muted-foreground">Subscription:</span> {selectedUser.subscription_tier || 'None'}</p>
                    <p><span className="text-muted-foreground">Status:</span> {selectedUser.subscription_status || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="daily" className="w-full">
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="total">Total</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <SessionsTable sessions={selectedUser.sessions.daily} />
                </TabsContent>
                <TabsContent value="weekly">
                  <SessionsTable sessions={selectedUser.sessions.weekly} />
                </TabsContent>
                <TabsContent value="monthly">
                  <SessionsTable sessions={selectedUser.sessions.monthly} />
                </TabsContent>
                <TabsContent value="total">
                  <SessionsTable sessions={selectedUser.sessions.total} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {userToDelete?.full_name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUserToDelete(null);
                setShowDeleteConfirm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && deleteUser(userToDelete.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SessionsTable = ({ sessions }: { sessions: SessionSummary[] }) => {
  if (sessions.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No sessions in this period</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Started</TableHead>
          <TableHead>Ended</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session, index) => (
          <TableRow key={index}>
            <TableCell>{format(new Date(session.started_at), 'PPp')}</TableCell>
            <TableCell>
              {session.ended_at
                ? format(new Date(session.ended_at), 'PPp')
                : 'Active'}
            </TableCell>
            <TableCell>{Math.round(session.duration_minutes)} minutes</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}; 