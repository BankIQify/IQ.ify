import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AuthError = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          <p>There was a problem initializing authentication:</p>
          <p className="mt-2 font-mono text-xs break-all">{error.message}</p>
          <p className="mt-4">Try refreshing the page or clearing your browser cache.</p>
        </AlertDescription>
      </Alert>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, authInitialized, authError, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (authError) {
    return <AuthError error={authError} />;
  }
  
  if (!authInitialized || isLoading) {
    return <AuthLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // If user is admin, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  // For regular users, show the protected content
  return <>{children}</>;
};