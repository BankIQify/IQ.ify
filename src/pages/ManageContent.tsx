import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ManageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleContentSync = async () => {
    setLoading(true);
    try {
      // Add your content sync logic here
      toast({
        title: "Success",
        description: "Content synced successfully",
      });
    } catch (error) {
      console.error('Error syncing content:', error);
      toast({
        title: "Error",
        description: "Failed to sync content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Pages: 0</p>
            <p>Published: 0</p>
            <p>Draft: 0</p>
            <Button 
              onClick={handleContentSync}
              disabled={loading}
              className="mt-4"
            >
              {loading ? "Syncing..." : "Sync Content"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Images: 0</p>
            <p>Videos: 0</p>
            <p>Documents: 0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-2">Create Page</Button>
            <Button className="w-full mb-2" variant="outline">Upload Media</Button>
            <Button className="w-full" variant="secondary">Manage Categories</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 