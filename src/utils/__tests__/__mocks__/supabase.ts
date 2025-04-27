import { vi } from 'vitest'

// Mock Supabase client
export const mockAuth = {
  getUser: vi.fn()
};

export const mockFrom = vi.fn();

export const mockSupabase = {
  auth: mockAuth,
  from: mockFrom
};

// Mock the Supabase client creation
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue(mockSupabase)
}));
