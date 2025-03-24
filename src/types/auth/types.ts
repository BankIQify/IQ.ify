
import { User } from "@supabase/supabase-js";
import { FocusArea } from "../auth";

export type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  avatar_config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  focus_areas: FocusArea[];
  subscription_tier: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
  subscription_expires_at: string | null;
};

export type ProfileData = {
  name: string | null;
  username?: string | null;
  avatar_url?: string | null;
  avatar_config?: Record<string, any>;
  focus_areas?: FocusArea[];
};

export type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, profileData: ProfileData) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
};
