import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthError } from "@/components/AuthError";
import { AuthLoader } from "@/components/AuthLoader";

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