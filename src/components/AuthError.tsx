import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const AuthError = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription>
        <p>There was a problem initializing authentication:</p>
        <p className="mt-2 font-mono text-xs break-all">{error.message}</p>
        <p className="mt-4">Try refreshing the page or clearing your browser cache.</p>
      </AlertDescription>
    </Alert>
  </div>
); 