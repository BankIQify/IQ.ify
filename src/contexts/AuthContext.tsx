
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth/types";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, signInWithEmail, signInWithGoogle, signUp, signOut } = useAuth();
  const { profile, getProfile, updateProfile } = useProfile(user);
  const { isAdmin, checkAdminStatus } = useAdminStatus();
  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Function to handle errors consistently
  const handleError = (error: unknown, context: string) => {
    console.error(`Auth error (${context}):`, error);
    
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
      setAuthError(error);
    } else if (typeof error === 'string') {
      errorMessage = error;
      setAuthError(new Error(error));
    } else {
      // Try to extract more information from the error
      try {
        const stringified = JSON.stringify(error);
        errorMessage = `Unknown error type: ${stringified}`;
        setAuthError(new Error(errorMessage));
      } catch (e) {
        console.error("Could not stringify error:", e);
      }
    }
    
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: `${context}: ${errorMessage}`
    });
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First set up the listener for auth state changes
        console.log('Setting up auth state change listener');
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log('Auth state changed:', { event, session: newSession?.user?.id });
          
          try {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
              console.log('User authenticated, fetching profile and checking roles');
              
              // Get profile and check admin status in parallel
              Promise.all([
                getProfile(newSession.user.id),
                checkAdminStatus(newSession.user.id)
              ]).catch(error => {
                handleError(error, "Failed to load user data after authentication");
              });
            } else {
              console.log('User logged out or no session');
            }
          } catch (error) {
            handleError(error, "Error handling auth state change");
          }
        });

        // Then check the initial session
        console.log('Checking initial session');
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            handleError(error, "Error fetching initial session");
            setAuthInitialized(true);
            return;
          }
          
          const initialSession = data.session;
          console.log('Initial session check:', initialSession?.user?.id ? 'Session found' : 'No session');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            console.log('Session found, checking profile and admin status');
            
            try {
              // Get profile and check admin status in parallel
              await Promise.all([
                getProfile(initialSession.user.id),
                checkAdminStatus(initialSession.user.id)
              ]);
            } catch (error) {
              handleError(error, "Error during initial profile/admin status check");
            }
          } else {
            console.log('No session found');
          }
        } catch (error) {
          handleError(error, "Unexpected error during session check");
        } finally {
          // Ensure we always set initialized to true
          setAuthInitialized(true);
        }

        return () => {
          console.log('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        handleError(error, "Critical error in auth setup");
        setAuthInitialized(true); // Make sure we set initialized even if there's an error
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    user,
    profile,
    isAdmin,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    authInitialized,
    authError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Rename this function to avoid naming conflict with the imported useAuth
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
