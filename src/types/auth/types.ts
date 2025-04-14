import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type FocusArea = 
  | "eleven_plus_prep"
  | "iq_improvement"
  | "focus_improvement"
  | "test_taking"
  | "problem_solving"
  | "time_management"
  | "confidence_building";

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'data_input' | 'pro' | 'user';
  subscription_status?: 'active' | 'trialing' | 'inactive';
  avatar_config: Record<string, any> | null;
  focus_areas: FocusArea[];
  subscription_tier: string | null;
  subscription_id: string | null;
  subscription_expires_at: string | null;
  full_name: string | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  education_level: string | null;
  subjects: string[];
}

export interface ProfileData {
  name?: string;
  username?: string;
  avatar_url?: string;
  avatar_config?: Record<string, any>;
  focus_areas?: FocusArea[];
  fullName?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  educationLevel?: string;
  subjects?: string[];
}

export function isAdminProfile(profile: Profile): boolean {
  return profile.role === 'admin';
}

export async function checkAdminStatus(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  if (error) {
    console.error('Error checking admin status:', error);
    return false;
  }

  return !!data;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isDataInput: boolean;
  authInitialized: boolean;
  authError: Error | null;
  signOut: () => Promise<void>;
  logActivity: (activityType: string, details?: any, success?: boolean) => Promise<void>;
};
