
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiKeyGenerationInfoProps {
  functionEndpoint: string;
}

export function ApiKeyGenerationInfo({ functionEndpoint }: ApiKeyGenerationInfoProps) {
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
  );
}
