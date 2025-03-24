
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Shield, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type UserDetails = {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  isAdmin: boolean;
};

export const AdminUsersList = () => {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const usersPerPage = 10;

  // Fetch users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all users from auth.users (this requires an admin role)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }

      if (!authUsers || !authUsers.users) {
        throw new Error("No users returned from Supabase.");
      }

      // Fetch user profiles to get additional information
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, name, avatar_url');
      
      if (profileError) {
        throw profileError;
      }

      // Fetch user roles to determine admin status
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('role', 'admin');
      
      if (rolesError) {
        throw rolesError;
      }

      // Map to create a set of admin user IDs for quick lookup
      const adminUserIds = new Set((userRoles || []).map(role => role.user_id));

      // Create a map of profiles by user ID
      const profileMap = new Map();
      (profiles || []).forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Combine auth users with profile data
      const combinedUsers = authUsers.users.map(user => {
        const profile = profileMap.get(user.id) || {};
        return {
          id: user.id,
          email: user.email,
          username: profile.username || null,
          name: profile.name || null,
          last_sign_in_at: user.last_sign_in_at,
          created_at: user.created_at,
          isAdmin: adminUserIds.has(user.id)
        };
      });

      setUsers(combinedUsers);
      setFilteredUsers(combinedUsers);
      console.log("Users loaded:", combinedUsers.length);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
      toast({
        title: "Error loading users",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term or role filter changes
  useEffect(() => {
    let result = users;
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.email?.toLowerCase().includes(search) || 
        user.username?.toLowerCase().includes(search) || 
        user.name?.toLowerCase().includes(search)
      );
    }
    
    // Filter by role
    if (roleFilter !== "all") {
      const isAdmin = roleFilter === "admin";
      result = result.filter(user => user.isAdmin === isAdmin);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, roleFilter, users]);

  // Pagination
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  // Render loading state
  if (loading) {
    return <div className="flex justify-center my-8">Loading users...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Error Loading Users</h3>
        <p>{error}</p>
        <Button 
          onClick={fetchUsers} 
          variant="outline" 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="user">Regular Users</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name || user.username || user.email.split("@")[0]}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "outline"} className="flex w-fit items-center gap-1">
                      {user.isAdmin ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          User
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.last_sign_in_at ? (
                      format(new Date(user.last_sign_in_at), "PPP")
                    ) : (
                      "Never"
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.created_at), "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No users found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * usersPerPage + 1}-
            {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
