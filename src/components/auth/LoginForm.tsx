import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
}

export const LoginForm = ({ onToggleMode, onGoogleSignIn }: LoginFormProps) => {
  const { signInWithPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await signInWithPassword(email, password);
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
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
        <div className="space-y-2">
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

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
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
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        <img
          src="/google.svg"
          alt="Google"
          className="w-5 h-5 mr-2"
        />
        Sign in with Google
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          className="text-sm text-muted-foreground hover:text-primary"
          onClick={onToggleMode}
          disabled={loading}
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </div>
  );
};
