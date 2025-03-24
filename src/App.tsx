
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AvatarCreator from "./pages/AvatarCreator";

const queryClient = new QueryClient();

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuthContext();
  const [hasDataInputRole, setHasDataInputRole] = useState(false);
  
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        if (error) {
          console.error('Error checking data_input role:', error);
          return;
        }

        setHasDataInputRole(!!data);
      } catch (error) {
        console.error('Error in checkDataInputRole:', error);
      }
    };

    checkDataInputRole();
  }, [user]);
  
  console.log('ProtectedAdminRoute check:', { user, isAdmin, hasDataInputRole }); // Debug log
  
  if (!user || (!isAdmin && !hasDataInputRole)) {
    return <NotFound />;
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lets-practice" element={<ManageExams />} />
              <Route path="/brain-training" element={<BrainTraining />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/progress/:subject" element={<SubjectProgress />} />
              <Route path="/practice/:category" element={<Practice />} />
              <Route 
                path="/manage-questions" 
                element={
                  <ProtectedAdminRoute>
                    <ManageQuestions />
                  </ProtectedAdminRoute>
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
