
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function WebhookKeysTable() {
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    fetchWebhookKeys();
  }, []);

  const fetchWebhookKeys = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('webhook_keys')
        .select('id, key_name, created_at, api_key, created_by')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setKeys(data || []);
      
      // Initialize visibility state for new keys
      const initialVisibility: Record<string, boolean> = {};
      data?.forEach(key => {
        initialVisibility[key.id] = false;
      });
      setVisibleKeys(prev => ({ ...prev, ...initialVisibility }));
      
    } catch (error) {
      console.error('Error fetching webhook keys:', error);
      setError('Failed to load webhook keys');
      toast({
        title: "Error",
        description: "Failed to load webhook keys",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: `API key for "${keyName}" copied to clipboard`,
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading webhook keys...</div>
      ) : keys.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          No webhook keys found. Use Postman to generate your first key.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-1/2">API Key</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.key_name}</TableCell>
                <TableCell>
                  {new Date(key.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 max-w-md overflow-x-auto">
                    <code className="text-xs bg-muted p-1 rounded whitespace-nowrap">
                      {visibleKeys[key.id] ? key.api_key : `${key.api_key.substring(0, 8)}...`}
                    </code>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {visibleKeys[key.id] ? (
                        <EyeOff className="h-3.5 w-3.5 mr-1" />
                      ) : (
                        <Eye className="h-3.5 w-3.5 mr-1" />
                      )}
                      {visibleKeys[key.id] ? "Hide" : "Show"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(key.api_key, key.key_name)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Button 
        variant="secondary" 
        onClick={fetchWebhookKeys}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? "Refreshing..." : "Refresh List"}
      </Button>
    </>
  );
}
