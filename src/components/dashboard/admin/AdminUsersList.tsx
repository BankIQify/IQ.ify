
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
import { MoreHorizontal, Search, Star, Shield, User, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AdminUsersList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Query to fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // In a real implementation, this would fetch from the profiles table with proper pagination
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
        .limit(10); // For demo purposes, limit to 10
      
      if (error) throw error;
      
      // Mock additional user role data
      return data.map(user => ({
        ...user,
        role: user.id === '1' ? 'admin' : 'user' // Mock role assignment
      }));
    },
  });

  // Mock user data if no data is fetched yet
  const mockUsers = [
    { 
      id: '1', 
      name: 'Admin User', 
      username: 'admin',
      avatar_url: null,
      subscription_tier: 'annual',
      subscription_status: 'active',
      subscription_expires_at: '2024-05-01',
      role: 'admin'
    },
    { 
      id: '2', 
      name: 'John Doe', 
      username: 'johndoe',
      avatar_url: null,
      subscription_tier: 'monthly',
      subscription_status: 'active',
      subscription_expires_at: '2023-07-15',
      role: 'user'
    },
    { 
      id: '3', 
      name: 'Jane Smith', 
      username: 'janesmith',
      avatar_url: null,
      subscription_tier: 'free',
      subscription_status: null,
      subscription_expires_at: null,
      role: 'data_input'
    },
    { 
      id: '4', 
      name: 'Alex Johnson', 
      username: 'alexj',
      avatar_url: null,
      subscription_tier: 'annual',
      subscription_status: 'active',
      subscription_expires_at: '2024-01-10',
      role: 'user'
    }
  ];

  const displayUsers = users || mockUsers;
  
  // Filter users based on search term and role filter
  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = 
      (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'data_input':
        return <Edit className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    // In a real implementation, update the user's role in the database
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`,
    });
    // After updating, refetch the user list
    refetch();
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
        
        <Select defaultValue={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="data_input">Data Input</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Status</TableHead>
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
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="h-8 w-8 rounded-full" />
                        ) : (
                          <span>{user.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div>{user.name}</div>
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
                    {user.subscription_tier ? (
                      <span className="capitalize">{user.subscription_tier}</span>
                    ) : (
                      <span className="text-muted-foreground">Free</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.subscription_status === 'active' ? (
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Inactive</div>
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                          <Shield className="h-4 w-4 mr-2" />
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
    </div>
  );
};
