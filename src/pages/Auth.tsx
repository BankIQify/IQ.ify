import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { EnhancedSignUpForm } from "@/components/auth/EnhancedSignUpForm";

const Auth = () => {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

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
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            {isLogin ? "Welcome Back" : "Create an Account"}
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
        </div>
      </Card>
    </div>
  );
};

export default Auth;
