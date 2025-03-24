
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
  const { toast } = useToast();

  useEffect(() => {
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
              console.error('Error during profile/admin status check:', error);
              toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "Failed to load user profile data. Please try refreshing the page."
              });
            });
          } else {
            console.log('User logged out or no session');
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem processing your authentication state. Please refresh the page."
          });
        }
      });

      // Then check the initial session
      console.log('Checking initial session');
      supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
        if (error) {
          console.error('Error fetching initial session:', error);
          toast({
            variant: "destructive",
            title: "Session Error",
            description: "Failed to retrieve your session. Please sign in again."
          });
          return;
        }
        
        console.log('Initial session check:', initialSession?.user?.id ? 'Session found' : 'No session');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log('Session found, checking profile and admin status');
          
          // Get profile and check admin status in parallel
          Promise.all([
            getProfile(initialSession.user.id),
            checkAdminStatus(initialSession.user.id)
          ]).catch(error => {
            console.error('Error during initial profile/admin status check:', error);
            toast({
              variant: "destructive",
              title: "Profile Error",
              description: "Failed to load your profile data. Please try refreshing the page."
            });
          });
        } else {
          console.log('No session found');
        }
      }).catch(error => {
        console.error('Unexpected error during session check:', error);
        toast({
          variant: "destructive",
          title: "Session Error",
          description: "An unexpected error occurred checking your session. Please try again."
        });
      });

      return () => {
        console.log('Cleaning up auth subscription');
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Critical error in auth setup:', error);
      toast({
        variant: "destructive",
        title: "Critical Auth Error",
        description: "A critical error occurred in the authentication setup. Please refresh the page."
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        signInWithEmail,
        signInWithGoogle,
        signUp,
        signOut,
        updateProfile,
      }}
    >
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
