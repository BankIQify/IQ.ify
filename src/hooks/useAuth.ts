import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { handleAuthError } from '@/utils/AuthUtils';

function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting email sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Unexpected error during email sign in:', error);
      handleAuthError(error);
      throw error;
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }, []);

  return {
    user,
    setUser,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  };
}

export { useAuth }; 