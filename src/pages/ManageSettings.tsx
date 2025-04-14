import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ManageSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSettingsSync = async () => {
    setLoading(true);
    try {
      // Add your settings sync logic here
      toast({
        title: "Success",
        description: "Settings synced successfully",
      });
    } catch (error) {
      console.error('Error syncing settings:', error);
      toast({
        title: "Error",
        description: "Failed to sync settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-2">Site Configuration</Button>
            <Button className="w-full mb-2" variant="outline">Email Settings</Button>
            <Button className="w-full" variant="secondary">API Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-2">Authentication</Button>
            <Button className="w-full mb-2" variant="outline">Permissions</Button>
            <Button className="w-full" variant="secondary">Backup & Recovery</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full mb-2"
              onClick={handleSettingsSync}
              disabled={loading}
            >
              {loading ? "Syncing..." : "Sync Settings"}
            </Button>
            <Button className="w-full mb-2" variant="outline">Export Config</Button>
            <Button className="w-full" variant="secondary">System Status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 