
import { createContext, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth/types";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useAdminStatus } from "@/hooks/useAdminStatus";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, signInWithEmail, signInWithGoogle, signUp, signOut } = useAuth();
  const { profile, getProfile, updateProfile } = useProfile(user);
  const { isAdmin, checkAdminStatus } = useAdminStatus();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setUser(session?.user ?? null);
      if (session?.user) {
        console.log('Session found, checking profile and admin status');
        getProfile(session.user.id);
        checkAdminStatus(session.user.id);
      } else {
        console.log('No session found');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session });
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id);
        checkAdminStatus(session.user.id);
      } else {
        // No need to reset profile and isAdmin as they're managed by their respective hooks
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
