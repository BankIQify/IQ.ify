
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function WebhookKeyManager() {
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const webhookUrl = `${window.location.origin.replace(/^http/, 'https')}/api/process-webhook`;
  const functionEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-webhook-key`;

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

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: description,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Integration Information</CardTitle>
          <CardDescription>
            Use these details to set up your webhook integrations with Make or other services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Webhook URL Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">1. Webhook Endpoint URL</h3>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <code className="text-sm flex-1 overflow-x-auto">{webhookUrl}</code>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(webhookUrl, "Webhook URL copied to clipboard")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is the URL to use when configuring your webhook destination
            </p>
          </div>

          {/* API Key Generation Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">2. Generate API Key Using Postman</h3>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Instructions</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  To generate a new webhook key, make a POST request to the following endpoint:
                </p>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <code className="text-sm flex-1 overflow-x-auto">{functionEndpoint}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(functionEndpoint, "Function endpoint copied to clipboard")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2">
                  Send a JSON body with a key name:
                </p>
                <pre className="p-2 bg-muted rounded-md text-sm overflow-x-auto">
                  {"{\n  \"keyName\": \"Your Key Name\"\n}"}
                </pre>
              </AlertDescription>
            </Alert>
          </div>

          {/* Header Format Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">3. Authentication Header Format</h3>
            <div className="p-2 bg-muted rounded-md">
              <code className="text-sm">x-webhook-key: YOUR_GENERATED_API_KEY</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Include this header with your API key in webhook requests
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.open("https://www.postman.com/downloads/", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Get Postman
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Webhook Keys</CardTitle>
          <CardDescription>
            List of webhook keys that have been generated for this application
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableHead>API Key (Partial)</TableHead>
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
                      <div className="flex items-center">
                        <code className="text-xs bg-muted p-1 rounded">
                          {key.api_key.substring(0, 8)}...
                        </code>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="secondary" 
            onClick={fetchWebhookKeys}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing..." : "Refresh List"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
