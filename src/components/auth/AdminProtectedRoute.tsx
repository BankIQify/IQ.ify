import React from 'react';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, isAdmin, isLoading, authInitialized } = useAuth();
  const location = useLocation();

  // While auth is initializing or loading the profile, show a spinner
  if (isLoading || !authInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Not logged in → to login page
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Logged in but not admin → to general dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // Logged in & is admin → render the admin page
  return <>{children}</>;
};
