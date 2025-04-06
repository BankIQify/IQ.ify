import { createContext, useContext, useEffect, useState, useCallback, startTransition } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, FocusArea } from "@/types/auth/types";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Request throttling configuration
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;
const MIN_EVENT_INTERVAL = 1000; // 1 second
const MAX_AUTH_STATE_CHANGES = 3;

// Utility function for throttled retries
const retryWithBackoff = async <T,>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    if (
      retries > 0 && 
      (error.message?.includes('Failed to fetch') || 
       error.message?.includes('ERR_INSUFFICIENT_RESOURCES'))
    ) {
      console.log(`Retrying operation in ${delay}ms, ${retries} retries left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(operation, retries - 1, delay * 2);
    }
    throw error;
  }
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isDataInput: boolean;
  authInitialized: boolean;
  authError: Error | null;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, profileData: Partial<Profile>) => Promise<any>;
  updateProfile: (data: Partial<Profile>) => Promise<Profile>;
  logActivity: (activityType: string, details?: any, success?: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDataInput, setIsDataInput] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const { toast } = useToast();

  const logActivity = useCallback(async (
    activityType: string,
    details: any = {},
    success: boolean = true
  ) => {
    if (!user) return;
    
    try {
      await retryWithBackoff(async () => {
        // First check if the table exists
        const { error: checkError } = await supabase
          .from('activity_logs')
          .select('id')
          .limit(1);

        // If table doesn't exist, log to console instead
        if (checkError?.code === '42P01') {
          console.log('Activity Log:', {
            user_id: user.id,
            activity_type: activityType,
            details,
            success,
            timestamp: new Date().toISOString()
          });
          return;
        }

        // If table exists, try to insert
        const { error } = await supabase.from('activity_logs').insert({
          user_id: user.id,
          activity_type: activityType,
          details,
          success,
        });

        if (error && error.code !== '42P01') {
          throw error;
        }
      });
    } catch (error) {
      // Just log to console, don't show toast for logging failures
      console.error('Error in activity logging:', error);
    }
  }, [user]);

  const startUserSession = useCallback(async () => {
    try {
      if (!user) return;
      await supabase.rpc('start_user_session', {
        p_user_agent: navigator.userAgent,
        p_ip_address: 'client-side'
      });
    } catch (error) {
      console.error('Error starting session:', error);
    }
  }, [user]);

  const endUserSession = useCallback(async () => {
    try {
      if (!user) return;
      await supabase.rpc('end_user_session');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  }, [user]);

  const checkUserRole = useCallback(async (userId: string) => {
    try {
      if (!userId) return { isAdmin: false, isDataInput: false };
      
      const roles = await retryWithBackoff(async () => {
        // Check for admin role
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();

        if (adminError && adminError.code !== 'PGRST116') {
          console.error('Error checking admin role:', adminError);
        }

        // Check for data_input role
        const { data: dataInputRole, error: dataInputError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'data_input')
          .single();

        if (dataInputError && dataInputError.code !== 'PGRST116') {
          console.error('Error checking data_input role:', dataInputError);
        }

        return {
          isAdmin: !!adminRole,
          isDataInput: !!dataInputRole
        };
      });

      return roles;
    } catch (error) {
      console.error('Unexpected error in checkUserRole:', error);
      return { isAdmin: false, isDataInput: false };
    }
  }, []);

  const createProfile = useCallback(async (userId: string, email: string): Promise<Profile> => {
    const newProfile = {
      id: userId,
      email: email,
      username: null,
      name: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    };

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .upsert(newProfile)
      .select()
      .single();

    if (createError) throw createError;
    if (!createdProfile) throw new Error('Failed to create profile');

    const profile: Profile = {
      id: String(createdProfile.id),
      email: String(createdProfile.email),
      username: createdProfile.username ? String(createdProfile.username) : null,
      name: createdProfile.name ? String(createdProfile.name) : null,
      avatar_url: createdProfile.avatar_url ? String(createdProfile.avatar_url) : null,
      created_at: String(createdProfile.created_at),
      updated_at: String(createdProfile.updated_at),
      last_sign_in_at: createdProfile.last_sign_in_at ? String(createdProfile.last_sign_in_at) : null,
      avatar_config: null,
      focus_areas: [],
      subscription_tier: null,
      subscription_id: null,
      subscription_expires_at: null,
      full_name: null,
      date_of_birth: null,
      country: null,
      city: null,
      education_level: null,
      subjects: []
    };

    return profile;
  }, []);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      if (!userId) return null;
      
      const result = await retryWithBackoff(async () => {
        // First try to fetch just the essential columns
        const { data: basicProfile, error: basicError } = await supabase
          .from('profiles')
          .select('id, email, username, name, avatar_url, created_at, updated_at, last_sign_in_at')
          .eq('id', userId)
          .single();

        // If profile doesn't exist, create it
        if (basicError?.code === 'PGRST116') {
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) throw new Error('No user found');
          return createProfile(userId, user.user.email || '');
        }

        if (basicError) {
          console.error('Error fetching basic profile:', basicError);
          return null;
        }

        if (!basicProfile) {
          console.warn('No profile found for user:', userId);
          return null;
        }

        // Try to fetch additional columns separately to handle missing columns gracefully
        const { data: additionalData } = await supabase
          .from('profiles')
          .select(`
            avatar_config,
            focus_areas,
            subscription_tier,
            subscription_id,
            subscription_expires_at,
            full_name,
            date_of_birth,
            country,
            city,
            education_level,
            subjects
          `)
          .eq('id', userId)
          .single();

        // Construct profile with basic data and any additional data that exists
        const profile: Profile = {
          id: String(basicProfile.id),
          email: String(basicProfile.email),
          username: basicProfile.username ? String(basicProfile.username) : null,
          name: basicProfile.name ? String(basicProfile.name) : null,
          avatar_url: basicProfile.avatar_url ? String(basicProfile.avatar_url) : null,
          created_at: basicProfile.created_at ? String(basicProfile.created_at) : new Date().toISOString(),
          updated_at: basicProfile.updated_at ? String(basicProfile.updated_at) : new Date().toISOString(),
          last_sign_in_at: basicProfile.last_sign_in_at ? String(basicProfile.last_sign_in_at) : null,
          avatar_config: additionalData?.avatar_config || null,
          focus_areas: Array.isArray(additionalData?.focus_areas) ? additionalData.focus_areas : [],
          subscription_tier: additionalData?.subscription_tier ? String(additionalData.subscription_tier) : null,
          subscription_id: additionalData?.subscription_id ? String(additionalData.subscription_id) : null,
          subscription_expires_at: additionalData?.subscription_expires_at ? String(additionalData.subscription_expires_at) : null,
          full_name: additionalData?.full_name ? String(additionalData.full_name) : null,
          date_of_birth: additionalData?.date_of_birth ? String(additionalData.date_of_birth) : null,
          country: additionalData?.country ? String(additionalData.country) : null,
          city: additionalData?.city ? String(additionalData.city) : null,
          education_level: additionalData?.education_level ? String(additionalData.education_level) : null,
          subjects: Array.isArray(additionalData?.subjects) ? additionalData.subjects.map(String) : []
        };

        return profile;
      });

      return result;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [createProfile]);

  const updateUserState = useCallback(async (user: User, session: Session) => {
    try {
      const { isAdmin: newIsAdmin, isDataInput: newIsDataInput } = await checkUserRole(user.id);
      const newProfile = await fetchProfile(user.id);
      
      startTransition(() => {
        setUser(user);
        setProfile(newProfile);
        setIsAdmin(newIsAdmin);
        setIsDataInput(newIsDataInput);
      });
      
      await startUserSession();
      
      // Log successful sign-in
      await logActivity('sign_in', {
        method: session?.provider_token ? 'oauth' : 'password',
        provider: session?.provider_token ? 'oauth' : 'email'
      });
    } catch (error) {
      console.error('Error updating user state:', error);
      throw error;
    }
  }, [checkUserRole, fetchProfile, startUserSession, logActivity]);

  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<Profile> => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      // Only include fields that we know exist in the database
      const essentialFields = {
        id: user.id,
        email: data.email,
        username: data.username,
        name: data.name,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString()
      };

      const result = await retryWithBackoff(async () => {
        // First update essential fields
        const { data: updatedProfile, error: basicError } = await supabase
          .from('profiles')
          .upsert(essentialFields)
          .select('id, email, username, name, avatar_url, created_at, updated_at, last_sign_in_at')
          .single();

        if (basicError) throw basicError;
        if (!updatedProfile) throw new Error('No profile returned after update');

        // Try to update additional fields if they exist
        const additionalFields = {
          avatar_config: data.avatar_config,
          focus_areas: data.focus_areas,
          subscription_tier: data.subscription_tier,
          subscription_id: data.subscription_id,
          subscription_expires_at: data.subscription_expires_at,
          full_name: data.full_name,
          date_of_birth: data.date_of_birth,
          country: data.country,
          city: data.city,
          education_level: data.education_level,
          subjects: data.subjects
        };

        const { data: additionalData } = await supabase
          .from('profiles')
          .update(additionalFields)
          .eq('id', user.id)
          .select(`
            avatar_config,
            focus_areas,
            subscription_tier,
            subscription_id,
            subscription_expires_at,
            full_name,
            date_of_birth,
            country,
            city,
            education_level,
            subjects
          `)
          .single();

        // Construct complete profile with both essential and additional data
        const profile: Profile = {
          id: String(updatedProfile.id),
          email: String(updatedProfile.email),
          username: updatedProfile.username ? String(updatedProfile.username) : null,
          name: updatedProfile.name ? String(updatedProfile.name) : null,
          avatar_url: updatedProfile.avatar_url ? String(updatedProfile.avatar_url) : null,
          created_at: updatedProfile.created_at ? String(updatedProfile.created_at) : new Date().toISOString(),
          updated_at: updatedProfile.updated_at ? String(updatedProfile.updated_at) : new Date().toISOString(),
          last_sign_in_at: updatedProfile.last_sign_in_at ? String(updatedProfile.last_sign_in_at) : null,
          avatar_config: additionalData?.avatar_config || null,
          focus_areas: Array.isArray(additionalData?.focus_areas) ? additionalData.focus_areas : [],
          subscription_tier: additionalData?.subscription_tier ? String(additionalData.subscription_tier) : null,
          subscription_id: additionalData?.subscription_id ? String(additionalData.subscription_id) : null,
          subscription_expires_at: additionalData?.subscription_expires_at ? String(additionalData.subscription_expires_at) : null,
          full_name: additionalData?.full_name ? String(additionalData.full_name) : null,
          date_of_birth: additionalData?.date_of_birth ? String(additionalData.date_of_birth) : null,
          country: additionalData?.country ? String(additionalData.country) : null,
          city: additionalData?.city ? String(additionalData.city) : null,
          education_level: additionalData?.education_level ? String(additionalData.education_level) : null,
          subjects: Array.isArray(additionalData?.subjects) ? additionalData.subjects.map(String) : []
        };

        return profile;
      });

      startTransition(() => {
        setProfile(result);
      });
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [user]);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      if (user) {
        await updateUserState(user, session);
      }
      return { user, session };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }, [updateUserState]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, profileData: Partial<Profile>) => {
    try {
      const { data: { user, session }, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            ...profileData,
            created_at: new Date().toISOString()
          }
        }
      });
      
      if (error) throw error;
      if (user) {
        await updateProfile({
          ...profileData,
          id: user.id,
          created_at: new Date().toISOString()
        });
        await updateUserState(user, session);
      }
      return { user, session };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }, [updateProfile, updateUserState]);

  const signOut = useCallback(async () => {
    try {
      await logActivity('sign_out');
      await endUserSession();
      await supabase.auth.signOut();
      startTransition(() => {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setIsDataInput(false);
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [endUserSession, logActivity]);

  useEffect(() => {
    let mounted = true;
    let authStateChangeCount = 0;
    let lastEventTimestamp = 0;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user && mounted) {
          await updateUserState(session.user, session);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          startTransition(() => {
            setAuthError(error as Error);
          });
        }
      } finally {
        if (mounted) {
          startTransition(() => {
            setAuthInitialized(true);
          });
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      // Prevent rapid-fire auth state changes
      const now = Date.now();
      if (now - lastEventTimestamp < MIN_EVENT_INTERVAL) {
        console.warn('Auth state change too frequent, ignoring...');
        return;
      }
      lastEventTimestamp = now;

      // Prevent infinite loops by limiting the number of auth state changes
      if (authStateChangeCount >= MAX_AUTH_STATE_CHANGES) {
        console.warn('Too many auth state changes, ignoring...');
        return;
      }
      authStateChangeCount++;
      
      if (event === 'SIGNED_OUT' && mounted) {
        startTransition(() => {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
          setIsDataInput(false);
        });
        await endUserSession();
      } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && mounted) {
        await updateUserState(session.user, session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateUserState, endUserSession]);

  const value = {
    user,
    profile,
    isAdmin,
    isDataInput,
    authInitialized,
    authError,
    signInWithPassword,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
