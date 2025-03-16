
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, AlertCircle, Eye, EyeOff } from "lucide-react";

export function WebhookKeyManager() {
  const [keyName, setKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Generating webhook key with name:', keyName);
      
      const { data, error } = await supabase.functions.invoke('generate-webhook-key', {
        body: { keyName: keyName.trim() }
      });
      
      console.log('Response from generate-webhook-key:', { data, error });

      if (error) throw error;

      if (data?.success && data?.key) {
        setGeneratedKey(data.key);
        toast({
          title: "Success",
          description: "Webhook key generated successfully",
        });
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Failed to generate key");
      }
    } catch (error) {
      console.error("Error generating webhook key:", error);
      setError(error.message || "Failed to generate webhook key");
      toast({
        title: "Error",
        description: error.message || "Failed to generate webhook key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied",
          description: "Key copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Error",
          description: "Failed to copy key",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Webhook API Key Generator</CardTitle>
        <CardDescription>
          Generate a secure API key for your Make (Integromat) webhook integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="keyName">Key Name</Label>
            <Input
              id="keyName"
              placeholder="Enter a name for this key"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
          </div>

          {generatedKey && (
            <Alert variant="default" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This key will only be shown once. Make sure to save it now.
              </AlertDescription>
              <div className="mt-2 relative">
                <Input
                  value={generatedKey}
                  readOnly
                  type={showKey ? "text" : "password"}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => copyToClipboard(generatedKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showKey ? "Hide" : "Show"} Key
              </Button>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleGenerateKey} 
          disabled={isLoading || !keyName.trim()}
        >
          {isLoading ? "Generating..." : "Generate Key"}
        </Button>
      </CardFooter>
    </Card>
  );
}
