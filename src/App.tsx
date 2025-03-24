
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ManageQuestions from "./pages/ManageQuestions";
import ManageExams from "./pages/ManageExams";
import BrainTraining from "./pages/BrainTraining";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SubjectProgress from "./pages/SubjectProgress";
import Practice from "./pages/Practice"; 
import Profile from "./pages/Profile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AvatarCreator from "./pages/AvatarCreator";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component for auth initialization
const AuthLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Component for routes that require either admin or data_input role
const ProtectedDataRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, authInitialized } = useAuthContext();
  const [hasDataInputRole, setHasDataInputRole] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        if (error) {
          console.error('Error checking data_input role:', error);
        }

        setHasDataInputRole(!!data);
      } catch (error) {
        console.error('Error in checkDataInputRole:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authInitialized) {
      checkDataInputRole();
    }
  }, [user, authInitialized]);
  
  console.log('ProtectedDataRoute check:', { user, isAdmin, hasDataInputRole, loading, authInitialized });
  
  if (!authInitialized || loading) {
    return <AuthLoader />;
  }
  
  if (!user || (!isAdmin && !hasDataInputRole)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Component for routes that require strictly admin role
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, authInitialized } = useAuthContext();
  
  console.log('ProtectedAdminRoute check:', { user, isAdmin, authInitialized });
  
  if (!authInitialized) {
    return <AuthLoader />;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-[rgba(30,174,219,0.05)] via-white to-[rgba(255,105,180,0.05)]">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedAdminRoute>
                    <Dashboard />
                  </ProtectedAdminRoute>
                } 
              />
              <Route path="/lets-practice" element={<ManageExams />} />
              <Route path="/brain-training" element={<BrainTraining />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/progress/:subject" element={<SubjectProgress />} />
              <Route path="/practice/:category" element={<Practice />} />
              <Route 
                path="/manage-questions" 
                element={
                  <ProtectedDataRoute>
                    <ManageQuestions />
                  </ProtectedDataRoute>
                } 
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/avatar-creator" element={<AvatarCreator />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
