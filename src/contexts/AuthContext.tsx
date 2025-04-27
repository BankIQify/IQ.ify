import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createBrowserClient } from '@supabase/ssr';
import type { Profile, ProfileData } from "@/types/auth/types";
import { User, Session, AuthError, Provider } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { isAdminProfile, checkAdminStatus } from "@/types/auth/types";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isDataInput: boolean;
  authInitialized: boolean;
  authError: AuthError | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, profileData: ProfileData) => Promise<any>;
  updateProfile: (data: ProfileData) => Promise<Profile>;
  logActivity: (activityType: string, details?: any, success?: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
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
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Create the Supabase client inside the component
  const supabase = createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
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
      setLoading(true);
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
      }
      setUser(session?.user ?? null);
      setAuthInitialized(true);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setAuthError(error as AuthError);
    } finally {
      setLoading(false);
    }
  }, [supabase, updateRoleState]);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeAuth(session);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      initializeAuth(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, supabase.auth]);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setIsDataInput(false);
      setAuthInitialized(false);
      toast({
        title: "Success",
        description: "Successfully signed out",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError(error as AuthError);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, toast]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      await initializeAuth(data.session);
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, initializeAuth]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
      await initializeAuth(data.session);
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, initializeAuth]);

  const signUp = useCallback(async (email: string, password: string, profileData: ProfileData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData,
        },
      });

      if (error) throw error;
      await initializeAuth(data.session);
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase.auth, initializeAuth]);

  const updateProfile = useCallback(async (data: ProfileData) => {
    try {
      setLoading(true);
      const { data: profile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(profile as unknown as Profile);
      await updateRoleState(profile as unknown as Profile);
      return profile as unknown as Profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase, user?.id, updateRoleState]);

  const logActivity = useCallback(async (activityType: string, details?: any, success?: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_activity')
        .insert([{
          user_id: user?.id,
          activity_type: activityType,
          details: details || {},
          success: success,
          timestamp: new Date().toISOString(),
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
      setAuthError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase, user?.id]);

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAdmin,
      isDataInput,
      authInitialized,
      authError,
      loading,
      signOut,
      signInWithPassword,
      signInWithGoogle,
      signUp,
      updateProfile,
      logActivity,
    }}>
      {children}
    </AuthContext.Provider>
  );
};