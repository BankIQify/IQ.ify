
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
    </div>
  );
}
