
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { UsernameField } from "./UsernameField";

interface SignUpFormProps {
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
}

export const SignUpForm = ({ onToggleMode, onGoogleSignIn }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleAuthError = (error: AuthError) => {
    console.error("Authentication error:", error);
    let message = "An error occurred during authentication.";

    switch (error.message) {
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
    
    if (!email || !password || !name) {
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

    setLoading(true);
    try {
      await signUp(email, password, { 
        name,
        username
      });
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
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
      
      <UsernameField 
        value={username}
        onChange={setUsername}
        disabled={loading}
      />

      <Button
        type="submit"
        className="w-full"
        variant="default"
        disabled={loading}
      >
        {loading ? "Loading..." : "Create Account"}
      </Button>

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
        Sign in with Google
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={onToggleMode}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};
