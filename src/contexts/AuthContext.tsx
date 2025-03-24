
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth/types";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, signInWithEmail, signInWithGoogle, signUp, signOut } = useAuth();
  const { profile, getProfile, updateProfile } = useProfile(user);
  const { isAdmin, checkAdminStatus } = useAdminStatus();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // First set up the listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', { event: _event, session: newSession });
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        console.log('User authenticated, fetching profile and checking roles');
        getProfile(newSession.user.id);
        checkAdminStatus(newSession.user.id);
      } else {
        console.log('User logged out or no session');
      }
    });

    // Then check the initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Initial session check:', initialSession);
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        console.log('Session found, checking profile and admin status');
        getProfile(initialSession.user.id);
        checkAdminStatus(initialSession.user.id);
      } else {
        console.log('No session found');
      }
    });

    return () => subscription.unsubscribe();
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
