
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { AuthError } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Auth = () => {
  const { user, signInWithGoogle } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
          <SignUpForm 
            onToggleMode={toggleAuthMode} 
            onGoogleSignIn={handleGoogleSignIn} 
          />
        )}
      </Card>
    </div>
  );
};

export default Auth;
