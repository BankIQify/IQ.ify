import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createBrowserClient } from '@supabase/ssr';
import type { Profile, ProfileData } from "@/types/auth/types";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { isAdminProfile, checkAdminStatus } from "@/types/auth/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isDataInput: boolean;
  authInitialized: boolean;
  authError: Error | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, profileData: ProfileData) => Promise<any>;
  updateProfile: (data: ProfileData) => Promise<Profile>;
  logActivity: (activityType: string, details?: any, success?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDataInput, setIsDataInput] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Create the Supabase client inside the component
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const updateRoleState = useCallback(async (profile: Profile | null) => {
    if (!profile) {
      setIsAdmin(false);
      setIsDataInput(false);
      return;
    }

    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.id);

      if (error) {
        console.error('Error checking roles:', error);
        setIsAdmin(false);
        setIsDataInput(false);
        return;
      }

      const isAdminRole = roles?.some(role => role.role === 'admin') ?? false;
      const isDataInputRole = roles?.some(role => role.role === 'data_input') ?? false;

      setIsAdmin(isAdminRole);
      setIsDataInput(isDataInputRole);
    } catch (error) {
      console.error('Error updating role state:', error);
      setIsAdmin(false);
      setIsDataInput(false);
    }
  }, [supabase]);

  const initializeAuth = useCallback(async (session: Session | null) => {
    try {
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setProfile(null);
          await updateRoleState(null);
          return;
        }

        if (profile) {
          const typedProfile = profile as unknown as Profile;
          setProfile(typedProfile);
          await updateRoleState(typedProfile);
        }
      } else {
        setProfile(null);
        await updateRoleState(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthError(error as Error);
      setProfile(null);
      await updateRoleState(null);
    }
  }, [supabase, updateRoleState]);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setAuthError(error);
            setAuthInitialized(true);
          }
          return;
        }

        if (mounted) {
          setUser(session?.user ?? null);
          await initializeAuth(session);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        if (mounted) {
          setAuthError(error as Error);
          setAuthInitialized(true);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        await initializeAuth(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setIsDataInput(false);
        setAuthInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initializeAuth, supabase]);

  const value: AuthContextType = {
    user,
    profile,
    isAdmin,
    isDataInput,
    authInitialized,
    authError,
    loading: !authInitialized,
    signInWithPassword: async (email: string, password: string) => {
      try {
        setAuthError(null);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } catch (error) {
        setAuthError(error as Error);
        throw error;
      }
    },
    signInWithGoogle: async () => {
      try {
        setAuthError(null);
        const { data, error } = await supabase.auth.signInWithOAuth({ 
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        setAuthError(error as Error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        setAuthError(null);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (error) {
        setAuthError(error as Error);
        throw error;
      }
    },
    signUp: async (email: string, password: string, profileData: ProfileData) => {
      try {
        setAuthError(null);
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: profileData
          }
        });
        if (error) throw error;
        return data;
      } catch (error) {
        setAuthError(error as Error);
        throw error;
      }
    },
    updateProfile: async (data: ProfileData) => {
      try {
        setAuthError(null);
        const { data: profile, error } = await supabase
          .from('profiles')
          .update(data)
          .eq('id', user?.id)
          .select()
          .single();
        if (error) throw error;
        return profile as Profile;
      } catch (error) {
        setAuthError(error as Error);
        throw error;
      }
    },
    logActivity: async (activityType: string, details?: any, success?: boolean) => {
      if (!user) return;
      try {
        const { error } = await supabase
          .from('user_activities')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            details,
            success: success ?? true
          });
        if (error) throw error;
      } catch (error) {
        console.error('Error logging activity:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 