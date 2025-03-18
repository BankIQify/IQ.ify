
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
      <h3 className="text-lg font-medium">2. Generate API Key</h3>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>API Reference</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="font-medium">Method:</div>
            <div className="col-span-2">POST</div>
            
            <div className="font-medium">URL:</div>
            <div className="col-span-2 flex items-center gap-2">
              <code className="text-xs flex-1 overflow-x-auto">{functionEndpoint}</code>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(functionEndpoint, "Function endpoint copied to clipboard")}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="font-medium">Headers:</div>
            <div className="col-span-2">
              <code className="text-xs">Content-Type: application/json</code>
            </div>
            
            <div className="font-medium">Request Body:</div>
            <div className="col-span-2">
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {"{\n  \"keyName\": \"Your Key Name\"\n}"}
              </pre>
              <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                ⚠️ Important: The property name must be exactly "keyName"
              </div>
            </div>
            
            <div className="font-medium">Response:</div>
            <div className="col-span-2">
              <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto">
                {"{\n  \"success\": true,\n  \"key\": \"generated-api-key\"\n}"}
              </pre>
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">For Make.com integration:</p>
        <div className="bg-muted p-2 rounded-md">
          <code className="text-xs font-bold">x-webhook-key: YOUR_GENERATED_API_KEY</code>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Use this exact header name in Make, not "authorization" or "bearer"
        </p>
      </div>
    </div>
  );
}
