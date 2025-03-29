import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { EnhancedSignUpForm } from "@/components/auth/EnhancedSignUpForm";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { user, signInWithGoogle } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle redirects and initial session
  useEffect(() => {
    // Check for redirect errors in URL
    const query = new URLSearchParams(window.location.search);
    const error = query.get('error');
    const errorDescription = query.get('error_description');
    
    if (error) {
      console.error("Auth redirect error:", error, errorDescription);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorDescription || "There was a problem with authentication",
      });
    }
  }, [toast]);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      console.log("Initiating Google sign in...");
      const handleWindowFocus = () => {
        console.log("Window focused - checking auth state");
        window.removeEventListener('focus', handleWindowFocus);
      };
      window.addEventListener('focus', handleWindowFocus);
      
      await signInWithGoogle();
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error:", error);
    let message = "An error occurred during authentication.";

    switch (error.message) {
      case "Invalid login credentials":
        message = "Email or password is incorrect. Please try again.";
        break;
      case "Email not confirmed":
        message = "Please check your email to confirm your account before signing in.";
        break;
      case "User already registered":
        message = "This email is already registered. Please sign in instead.";
        break;
      default:
        message = error.message;
    }

    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: message,
    });
  };

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>
        
        {isLogin ? (
          <LoginForm 
            onToggleMode={toggleAuthMode}
            onGoogleSignIn={handleGoogleSignIn}
          />
        ) : (
          <EnhancedSignUpForm 
            onToggleMode={toggleAuthMode}
            onGoogleSignIn={handleGoogleSignIn}
          />
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-lg px-6 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img
            src="/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleAuthMode}
            className="text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default Auth;
