import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Profile, ProfileData } from "@/types/auth/types";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError } from '@/utils/auth/errorHandler';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isDataInput: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  authInitialized: boolean;
  authError: Error | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  signOut: (callback?: () => void) => void;
  signIn: (credentials?: { provider?: 'google' | 'github' | 'facebook'; email?: string; password?: string }) => Promise<{ user: User | null; error: Error | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isDataInput: false,
  isAdmin: false,
  isLoading: true,
  authInitialized: false,
  authError: null,
  activeTab: 'overview',
  setActiveTab: () => {},
  signOut: () => {},
  signIn: async () => ({ user: null, error: null })
});

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('[AuthProvider] Rendering component body');

  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDataInput, setIsDataInput] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Update role-based values when profile changes
  useEffect(() => {
    if (profile) {
      setIsDataInput(profile.role === 'data_input');
      setIsAdmin(profile.role === 'admin');
    } else {
      setIsDataInput(false);
      setIsAdmin(false);
    }
  }, [profile]);

  const fetchProfile = useCallback(async (userId: string) => {
    console.log('[Profile Fetch] starting for user:', userId);
    const { data: profileData, error: profileError, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single() as { data: Profile | null; error: any; status: number };

    console.log('[Profile Fetch] status:', status);
    console.log('[Profile Fetch] error:', profileError);
    console.log('[Profile Fetch] data:', profileData);
    
    setProfile(profileData ?? null);
    console.log('[Profile State] setProfile to:', profileData);

    if (profileError && status !== 406) {
      handleAuthError(profileError);
    }
  }, []);

  useEffect(() => {
    console.log('[AuthProvider] useEffect ran');

    // 1) On initial load, fetch existing session:
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[Auth Init] session user:', session?.user?.id);
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setLoading(false);
      setAuthInitialized(true);
    });

    // 2) Subscribe to all auth changes:
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth Event]', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        console.log('[Profile State] clearing profile');
        setUser(null);
        setProfile(null);
        setIsDataInput(false);
        setIsAdmin(false);
        setActiveTab('overview');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (credentials?: { provider?: 'google' | 'github' | 'facebook'; email?: string; password?: string }) => {
    try {
      setLoading(true);
      setAuthError(null);

      let result;
      if (credentials?.provider) {
        result = await supabase.auth.signInWithOAuth({
          provider: credentials.provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email: credentials.email!,
          password: credentials.password!
        });
      }

      const { data, error } = result;
      
      if (error) {
        handleAuthError(error);
      }

      if (!data?.session?.user) {
        throw new Error('No user session after sign in');
      }

      setUser(data.session.user);
      await fetchProfile(data.session.user.id);
      return { user: data.session.user, error: null };
    } catch (error) {
      handleAuthError(error);
      return { user: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const signOut = useCallback(async (callback?: () => void) => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setIsDataInput(false);
      setIsAdmin(false);
      setActiveTab('overview');
      
      if (callback) {
        callback();
      }
    } catch (error) {
      handleAuthError(error);
    }
  }, []);

  const value = {
    user,
    profile,
    isDataInput,
    isAdmin,
    isLoading,
    authInitialized,
    authError,
    activeTab,
    setActiveTab,
    signOut,
    signIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};