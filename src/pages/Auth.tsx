
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthError } from "@supabase/supabase-js";
import { FocusArea, focusAreaLabels } from "@/types/auth";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Auth = () => {
  const { user, signInWithEmail, signInWithGoogle, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { toast } = useToast();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [alternativeUsernames, setAlternativeUsernames] = useState<string[]>([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<FocusArea[]>([]);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle username change and check availability
  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    
    if (!value) {
      setUsernameAvailable(true);
      setAlternativeUsernames([]);
      return;
    }
    
    if (value.length < 3) {
      return;
    }

    setCheckingUsername(true);
    try {
      // Check if username exists
      const { data, error } = await supabase
        .rpc('username_exists', { 
          username_to_check: value 
        });
      
      if (error) throw error;
      
      setUsernameAvailable(!data);
      
      if (data) {
        // If username is taken, get alternatives
        const { data: alternatives, error: altError } = await supabase
          .rpc('generate_alternative_usernames', { 
            base_username: value 
          });
          
        if (altError) throw altError;
        setAlternativeUsernames(alternatives || []);
      } else {
        setAlternativeUsernames([]);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const selectAlternativeUsername = (alt: string) => {
    setUsername(alt);
    setUsernameAvailable(true);
    setAlternativeUsernames([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    // Additional validation for registration
    if (!isLogin) {
      if (!name) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields",
        });
        return;
      }

      if (!username) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please enter a username",
        });
        return;
      }

      if (!usernameAvailable) {
        toast({
          variant: "destructive",
          title: "Username Error",
          description: "This username is already taken. Please choose another or select one of the suggested alternatives.",
        });
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUp(email, password, { 
          name,
          username
        });
      }
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFocusAreaToggle = (focusArea: FocusArea) => {
    setSelectedFocusAreas(current =>
      current.includes(focusArea)
        ? current.filter(area => area !== focusArea)
        : [...current, focusArea]
    );
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          {isLogin ? "Sign In" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-label="Email"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              aria-label="Password"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  aria-label="Name"
                />
              </div>
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    required
                    disabled={loading || checkingUsername}
                    aria-label="Username"
                    className={!usernameAvailable ? "border-red-500" : ""}
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-2">
                      <div className="animate-spin h-5 w-5 border-2 border-education-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {!usernameAvailable && username && (
                  <div className="mt-2">
                    <p className="text-red-500 text-sm mb-1">Username is already taken. Try one of these:</p>
                    <div className="flex flex-wrap gap-2">
                      {alternativeUsernames.map((alt, idx) => (
                        <Button 
                          key={idx} 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={() => selectAlternativeUsername(alt)}
                        >
                          {alt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {username && usernameAvailable && username.length >= 3 && (
                  <p className="text-green-500 text-sm mt-1">Username is available!</p>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            variant="default"
            disabled={loading || (!isLogin && !usernameAvailable)}
          >
            {loading
              ? "Loading..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          Sign in with Google
        </Button>

        <div className="text-center text-sm">
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
