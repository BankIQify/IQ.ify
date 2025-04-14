import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  onToggleMode: () => void;
  onGoogleSignIn: () => Promise<void>;
}

export const LoginForm = ({ onToggleMode, onGoogleSignIn }: LoginFormProps) => {
  const { signInWithPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
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
      case "Too many requests":
        message = "Too many login attempts. Please try again later.";
        break;
      case "Network error":
        message = "Unable to connect to the server. Please check your internet connection.";
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      await signInWithPassword(email, password);
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFormErrors(prev => ({ ...prev, email: undefined }));
          }}
          required
          disabled={loading}
          aria-label="Email"
          className={`bg-transparent border-[#1EAEDB]/20 focus:border-[#1EAEDB] focus:ring-[#1EAEDB]/20 ${
            formErrors.email ? "border-red-500" : ""
          }`}
        />
        {formErrors.email && (
          <p className="text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFormErrors(prev => ({ ...prev, password: undefined }));
          }}
          required
          disabled={loading}
          aria-label="Password"
          className={`bg-transparent border-[#1EAEDB]/20 focus:border-[#1EAEDB] focus:ring-[#1EAEDB]/20 ${
            formErrors.password ? "border-red-500" : ""
          }`}
        />
        {formErrors.password && (
          <p className="text-sm text-red-500">{formErrors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-[#1EAEDB] text-white hover:bg-[#1EAEDB]/90"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#1EAEDB]/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-[#1EAEDB]">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-[#1EAEDB]/20 hover:border-[#1EAEDB] hover:bg-[#1EAEDB]/5"
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
          className="text-sm text-[#1EAEDB] hover:text-[#1EAEDB]/80"
          onClick={onToggleMode}
          disabled={loading}
        >
          Don't have an account? Sign up
        </Button>
      </div>
    </form>
  );
};
