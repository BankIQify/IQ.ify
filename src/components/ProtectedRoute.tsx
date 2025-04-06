import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AuthLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading authentication...</p>
    </div>
  </div>
);

const AuthError = ({ error }: { error: Error }) => (
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

export const ProtectedRoute = () => {
  const { user, authInitialized, authError } = useAuth();
  
  if (authError) {
    return <AuthError error={authError} />;
  }
  
  if (!authInitialized) {
    return <AuthLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}; 