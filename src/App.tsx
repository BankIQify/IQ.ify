import '@fontsource/playfair-display';
import '@fontsource/inter';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Outlet, useLocation, RouterProvider, createBrowserRouter, UNSAFE_DataRouterContext } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import TakeExam from "./pages/TakeExam";
import Profile from "./pages/Profile";
import LetsPractice from "./pages/LetsPractice";
import UserLogs from "./pages/UserLogs";
import { useState, useEffect, Suspense, startTransition } from "react";
import { supabase } from "@/integrations/supabase/client";
import AvatarCreator from "./pages/AvatarCreator";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import ManageSubscription from '@/pages/subscription/ManageSubscription';
import { AboutUs } from '@/pages/AboutUs';
import { DataInputLayout } from "@/components/layout/DataInputLayout";
import WebhookDataPage from "@/pages/WebhookDataPage";
import QuestionEditor from "@/pages/QuestionEditor";
import { routes } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";

console.log('App component loading...');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true
  }
});

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen p-4">
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Application Error</AlertTitle>
      <AlertDescription>
        <p>There was a problem loading the application:</p>
        <p className="mt-2 font-mono text-xs break-all">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors"
        >
          Try reloading
        </button>
      </AlertDescription>
    </Alert>
  </div>
);

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

const ProtectedRoute = () => {
  const { user, authInitialized, authError } = useAuth();
  const [isDataInput, setIsDataInput] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        startTransition(() => {
          setIsDataInput(!!data);
        });
        
        // If user is data input and not already on a data-input route, redirect them
        if (!!data && !location.pathname.startsWith('/data-input')) {
          navigate('/data-input/webhook');
        }
      } catch (error) {
        console.error('Error checking data_input role:', error);
      }
    };

    if (authInitialized) {
      checkDataInputRole();
    }
  }, [user, authInitialized, navigate, location]);
  
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

const DataInputProtectedRoute = () => {
  const { user, authInitialized, authError } = useAuth();
  const [isDataInput, setIsDataInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDataInputRole = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('role', 'data_input')
          .maybeSingle();

        startTransition(() => {
          setIsDataInput(!!data);
        });
        
        // If user is not data input, redirect to home
        if (!data) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking data_input role:', error);
      }
    };

    if (authInitialized) {
      checkDataInputRole();
    }
  }, [user, authInitialized, navigate]);

  if (authError) {
    return <AuthError error={authError} />;
  }
  
  if (!authInitialized) {
    return <AuthLoader />;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isDataInput) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const App = () => {
  console.log('Rendering App component...');
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
};

export default App;

