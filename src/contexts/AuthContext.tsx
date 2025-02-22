
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data: adminRoleCheck, error: adminCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        return;
      }

      console.log('Admin check result:', adminRoleCheck);
      const hasAdminRole = !!adminRoleCheck;
      console.log('Setting isAdmin to:', hasAdminRole);
      setIsAdmin(hasAdminRole);

    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check active sessions
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

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session });
      setUser(session?.user ?? null);
      if (session?.user) {
        getProfile(session.user.id);
        checkAdminStatus(session.user.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in getProfile:", error);
      setProfile(null);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Attempting email sign in:', email);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
      throw error;
    }

    console.log('Sign in successful:', data);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in with Google",
        description: error.message,
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
      throw error;
    } else {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, isAdmin, signInWithEmail, signInWithGoogle, signUp, signOut }}
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
