import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';

export const GoogleSignInButton = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // Use Supabase's built-in Google auth
      await signIn({ provider: 'google' });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M23.999 7.832c0-.79-.07-1.562-.2-2.318H12v4.844h5.951c-.262 1.432-.93 2.727-1.92 3.817v2.773h3.328c1.971-1.83 3.138-4.31 3.138-7.23z" />
            <path d="M12 12c2.11 0 3.879-.84 5.168-2.185l-.003-.863H12v4.844z" />
            <path d="M5.844 14.092c-.004-.207-.006-.417-.006-.63s.002-.422.006-.63h.016A8.993 8.993 0 0 1 12 3c2.828 0 5.229 1.933 6.168 4.688l-3.328 2.661C10.71 12.233 8.11 14 5.844 14.092z" />
          </svg>
          Sign in with Google
        </>
      )}
    </Button>
  );
};
