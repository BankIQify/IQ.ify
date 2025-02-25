
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dqaihawavxlacegykwqu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxYWloYXdhdnhsYWNlZ3lrd3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNjQyMzksImV4cCI6MjA1NTg0MDIzOX0.kEenDC5rURK5SFuf9hDQOn51hlryeMsTrVFFuEm0n7o";

// Initialize the Supabase client with function invocation URL
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);

