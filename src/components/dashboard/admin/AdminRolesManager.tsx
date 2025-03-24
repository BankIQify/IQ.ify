
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, ShieldCheck, Shield, Edit, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
};

type Permission = {
  id: string;
  name: string;
  description: string;
};

export const AdminRolesManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Admin",
      description: "Full system access with all permissions",
      permissions: [
        { id: "p1", name: "user.read", description: "View user information" },
        { id: "p2", name: "user.write", description: "Modify user information" },
        { id: "p3", name: "content.read", description: "View all content" },
        { id: "p4", name: "content.write", description: "Create and edit content" },
        { id: "p5", name: "system.config", description: "Modify system configuration" },
      ],
      userCount: 3,
    },
    {
      id: "2",
      name: "Data Input",
      description: "Can manage questions and content",
      permissions: [
        { id: "p3", name: "content.read", description: "View all content" },
        { id: "p4", name: "content.write", description: "Create and edit content" },
      ],
      userCount: 8,
    },
    {
      id: "3",
      name: "User",
      description: "Standard user with basic access",
      permissions: [
        { id: "p6", name: "profile.read", description: "View own profile" },
        { id: "p7", name: "profile.write", description: "Edit own profile" },
        { id: "p8", name: "content.access", description: "Access learning content" },
      ],
      userCount: 1243,
    },
  ]);

  const [roleBeingEdited, setRoleBeingEdited] = useState<Role | null>(null);
  const [availablePermissions] = useState<Permission[]>([
    { id: "p1", name: "user.read", description: "View user information" },
    { id: "p2", name: "user.write", description: "Modify user information" },
    { id: "p3", name: "content.read", description: "View all content" },
    { id: "p4", name: "content.write", description: "Create and edit content" },
    { id: "p5", name: "system.config", description: "Modify system configuration" },
    { id: "p6", name: "profile.read", description: "View own profile" },
    { id: "p7", name: "profile.write", description: "Edit own profile" },
    { id: "p8", name: "content.access", description: "Access learning content" },
    { id: "p9", name: "reports.access", description: "Access report data" },
    { id: "p10", name: "billing.manage", description: "Manage billing information" },
  ]);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditRole = (role: Role) => {
    setRoleBeingEdited(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => p.id),
    });
    setIsEditMode(true);
    setDialogOpen(true);
  };

  const handleCreateNewRole = () => {
    setRoleBeingEdited(null);
    setNewRole({
      name: "",
      description: "",
      permissions: [],
    });
    setIsEditMode(false);
    setDialogOpen(true);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewRole(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId];
      
      return {
        ...prev,
        permissions: updatedPermissions,
      };
    });
  };

  const handleSaveRole = () => {
    if (!newRole.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode && roleBeingEdited) {
      // Update existing role
      setRoles(prev => 
        prev.map(role => 
          role.id === roleBeingEdited.id 
            ? {
                ...role,
                name: newRole.name,
                description: newRole.description,
                permissions: availablePermissions.filter(p => newRole.permissions.includes(p.id)),
              }
            : role
        )
      );

      toast({
        title: "Role updated",
        description: `The role "${newRole.name}" has been updated successfully.`,
      });
    } else {
      // Create new role
      const newRoleId = (roles.length + 1).toString();
      
      setRoles(prev => [
        ...prev,
        {
          id: newRoleId,
          name: newRole.name,
          description: newRole.description,
          permissions: availablePermissions.filter(p => newRole.permissions.includes(p.id)),
          userCount: 0,
        },
      ]);

      toast({
        title: "Role created",
        description: `The role "${newRole.name}" has been created successfully.`,
      });
    }

    setDialogOpen(false);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'data input':
        return <Edit className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-blue-500" />;
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={handleCreateNewRole} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role.name)}
                    <span className="font-medium">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission.id} variant="outline" className="text-xs">
                        {permission.name}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{role.userCount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Edit</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No roles found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Modify the role details and permissions.' 
                : 'Define a new role with specific permissions.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="roleName" className="block text-sm font-medium mb-1">
                Role Name
              </label>
              <Input
                id="roleName"
                value={newRole.name}
                onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                placeholder="Enter role name"
              />
            </div>
            
            <div>
              <label htmlFor="roleDescription" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                id="roleDescription"
                value={newRole.description}
                onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                placeholder="Enter role description"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Permissions
              </label>
              <Card>
                <CardContent className="p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={newRole.permissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <div>{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>
              {isEditMode ? 'Update Role' : 'Create Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
