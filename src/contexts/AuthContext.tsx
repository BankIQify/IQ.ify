
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FocusArea } from "@/types/auth";

type Profile = {
  id: string;
  name: string | null;
  age: number | null;
  city: string | null;
  country: string | null;
  school: string | null;
  focus_areas: FocusArea[];
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, profileData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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

      if (data) {
        // Fetch focus areas
        const { data: focusAreasData, error: focusAreasError } = await supabase
          .from("user_focus_areas")
          .select("focus_area")
          .eq("user_id", userId);

        if (focusAreasError) {
          console.error("Error fetching focus areas:", focusAreasError);
        } else {
          data.focus_areas = focusAreasData?.map(fa => fa.focus_area) || [];
        }
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in getProfile:", error);
      setProfile(null);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log('Attempting email sign in:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, profileData: Partial<Profile>) => {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;

    if (data.user) {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          age: profileData.age,
          country: profileData.country,
          city: profileData.city,
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      // Insert focus areas
      if (profileData.focus_areas && profileData.focus_areas.length > 0) {
        const focusAreasToInsert = profileData.focus_areas.map(focus_area => ({
          user_id: data.user.id,
          focus_area,
        }));

        const { error: focusAreasError } = await supabase
          .from('user_focus_areas')
          .insert(focusAreasToInsert);

        if (focusAreasError) {
          console.error("Error inserting focus areas:", focusAreasError);
          throw focusAreasError;
        }
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

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
