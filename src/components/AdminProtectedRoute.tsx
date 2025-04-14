import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError } from "@/components/AuthError";
import { AuthLoader } from "@/components/AuthLoader";
import { isAdminProfile, checkAdminStatus } from "@/types/auth/types";
import { useEffect, useState } from "react";

export const AdminProtectedRoute = () => {
  const { user, authInitialized, authError, profile, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await checkAdminStatus(user.id);
        setIsAdminUser(adminStatus);
      }
      setIsLoading(false);
    };
    
    checkAdmin();
  }, [user]);
  
  if (authError) {
    return <AuthError error={authError} />;
  }
  
  if (!authInitialized || isLoading) {
    return <AuthLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check both the profile role and the user_roles table
  if (!isAdmin && !isAdminUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}; 