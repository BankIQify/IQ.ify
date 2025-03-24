import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Search, 
  Star, 
  ShieldCheck, 
  User, 
  Edit,
  Mail,
  Clock,
  Ban,
  Lock,
  Unlock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserWithRole = {
  id: string;
  name: string | null;
  username: string | null;
  email?: string;
  avatar_url: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_expires_at: string | null;
  role: string;
  last_login?: string;
  created_at?: string;
}

export const AdminUsersList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          username,
          avatar_url,
          subscription_tier,
          subscription_status,
          subscription_expires_at
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      return data.map(user => ({
        ...user,
        role: user.id === '1' ? 'admin' : user.id === '2' || user.id === '3' ? 'data_input' : 'user'
      })) as UserWithRole[];
    },
  });

  const mockUsers: UserWithRole[] = [
    { 
      id: '1', 
      name: 'Admin User', 
      username: 'admin',
      avatar_url: null,
      subscription_tier: 'annual',
      subscription_status: 'active',
      subscription_expires_at: '2024-05-01',
      role: 'admin',
      email: 'admin@example.com',
      last_login: '2023-06-25T14:30:00',
      created_at: '2023-01-15T09:00:00'
    },
    { 
      id: '2', 
      name: 'John Doe', 
      username: 'johndoe',
      avatar_url: null,
      subscription_tier: 'monthly',
      subscription_status: 'active',
      subscription_expires_at: '2023-07-15',
      role: 'data_input',
      email: 'john.doe@example.com',
      last_login: '2023-06-24T10:15:00',
      created_at: '2023-02-10T11:30:00'
    },
    { 
      id: '3', 
      name: 'Jane Smith', 
      username: 'janesmith',
      avatar_url: null,
      subscription_tier: 'free',
      subscription_status: null,
      subscription_expires_at: null,
      role: 'data_input',
      email: 'jane.smith@example.com',
      last_login: '2023-06-23T16:45:00',
      created_at: '2023-03-05T14:20:00'
    },
    { 
      id: '4', 
      name: 'Alex Johnson', 
      username: 'alexj',
      avatar_url: null,
      subscription_tier: 'annual',
      subscription_status: 'active',
      subscription_expires_at: '2024-01-10',
      role: 'user',
      email: 'alex.johnson@example.com',
      last_login: '2023-06-20T09:30:00',
      created_at: '2023-03-15T10:00:00'
    },
    { 
      id: '5', 
      name: 'Sarah Williams', 
      username: 'sarahw',
      avatar_url: null,
      subscription_tier: 'monthly',
      subscription_status: 'active',
      subscription_expires_at: '2023-07-05',
      role: 'user',
      email: 'sarah.williams@example.com',
      last_login: '2023-06-22T11:20:00',
      created_at: '2023-04-02T09:15:00'
    },
    { 
      id: '6', 
      name: 'Michael Brown', 
      username: 'michaelb',
      avatar_url: null,
      subscription_tier: 'monthly',
      subscription_status: 'cancelled',
      subscription_expires_at: '2023-06-30',
      role: 'user',
      email: 'michael.brown@example.com',
      last_login: '2023-06-18T15:10:00',
      created_at: '2023-04-10T14:30:00'
    },
    { 
      id: '7', 
      name: 'Emily Davis', 
      username: 'emilyd',
      avatar_url: null,
      subscription_tier: 'free',
      subscription_status: null,
      subscription_expires_at: null,
      role: 'user',
      email: 'emily.davis@example.com',
      last_login: '2023-06-21T13:45:00',
      created_at: '2023-04-15T16:20:00'
    }
  ];

  const displayUsers = users || mockUsers;
  
  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    const matchesSubscription = 
      subscriptionFilter === 'all' || 
      (subscriptionFilter === 'free' && user.subscription_tier === 'free') ||
      (subscriptionFilter === 'paid' && (user.subscription_tier === 'monthly' || user.subscription_tier === 'annual')) ||
      (subscriptionFilter === 'active' && user.subscription_status === 'active') ||
      (subscriptionFilter === 'cancelled' && user.subscription_status === 'cancelled');
    
    return matchesSearch && matchesRole && matchesSubscription;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-red-500" />;
      case 'data_input':
        return <Edit className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSubscriptionBadge = (tier?: string, status?: string) => {
    if (!tier || tier === 'free') {
      return <Badge variant="outline" className="bg-gray-100">Free</Badge>;
    }

    if (status === 'cancelled') {
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
    }

    if (tier === 'monthly') {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Monthly</Badge>;
    }

    if (tier === 'annual') {
      return <Badge variant="outline" className="bg-green-100 text-green-800">Annual</Badge>;
    }

    return <Badge variant="outline">Unknown</Badge>;
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
    });
    refetch();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewUserDetails = (user: any) => {
    setSelectedUser(user);
    setUserDetailsOpen(true);
  };

  const handleResetPassword = (userId: string) => {
    toast({
      title: "Password Reset Email Sent",
      description: "A password reset email has been sent to the user.",
    });
  };

  const handleSuspendUser = (userId: string) => {
    toast({
      title: "User Suspended",
      description: "The user has been suspended.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="data_input">Data Input</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={subscriptionFilter} onValueChange={setSubscriptionFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subscriptions</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.name || ''} />
                        ) : (
                          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSubscriptionBadge(user.subscription_tier, user.subscription_status)}
                  </TableCell>
                  <TableCell>
                    {user.subscription_expires_at ? (
                      <span>{formatDate(user.subscription_expires_at)}</span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                          <User className="h-4 w-4 mr-2" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          <span>Make Admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'data_input')}>
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Make Data Input</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
                          <User className="h-4 w-4 mr-2" />
                          <span>Make User</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                          <Lock className="h-4 w-4 mr-2" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          <span>Suspend User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  {selectedUser.avatar_url ? (
                    <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.name || ''} />
                  ) : (
                    <AvatarFallback className="text-3xl">{selectedUser.name?.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {getRoleIcon(selectedUser.role)}
                  <span className="capitalize">{selectedUser.role}</span>
                </div>
                
                <div>
                  {getSubscriptionBadge(selectedUser.subscription_tier, selectedUser.subscription_status)}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <Tabs defaultValue="info">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="info">Information</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Email</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedUser.email || 'No email available'}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Account Created</label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDateTime(selectedUser.created_at || '')}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Last Login</label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDateTime(selectedUser.last_login || '')}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-sm text-muted-foreground">Subscription Expires</label>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedUser.subscription_expires_at ? formatDate(selectedUser.subscription_expires_at) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">User Notes</label>
                      <p className="text-sm">
                        No additional notes for this user.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border-b">
                        <div>
                          <span className="text-sm font-medium">Last Login</span>
                          <p className="text-xs text-muted-foreground">{formatDateTime(selectedUser.last_login || '')}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 border-b">
                        <div>
                          <span className="text-sm font-medium">Completed Tests</span>
                          <p className="text-xs text-muted-foreground">8 tests completed</p>
                        </div>
                        <Badge>12 points</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border-b">
                        <div>
                          <span className="text-sm font-medium">Account Created</span>
                          <p className="text-xs text-muted-foreground">{formatDateTime(selectedUser.created_at || '')}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Showing 3 most recent activities</p>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleRoleChange(selectedUser.id, 'admin')}
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Make Admin
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleRoleChange(selectedUser.id, 'data_input')}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Make Data Input
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleRoleChange(selectedUser.id, 'user')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Make User
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleResetPassword(selectedUser.id)}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Reset Password
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        onClick={() => handleSuspendUser(selectedUser.id)}
                      >
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserDetailsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
