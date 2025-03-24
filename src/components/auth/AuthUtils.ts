
import { AuthError } from "@supabase/supabase-js";
import { UseToastReturn } from "@/hooks/use-toast";

export const handleAuthError = (error: AuthError, toast: UseToastReturn["toast"]) => {
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
