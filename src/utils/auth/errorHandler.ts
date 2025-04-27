import { AuthError } from '@supabase/supabase-js';

export function handleAuthError(error: unknown): never {
  console.error('Auth error details:', error);
  
  if (error instanceof AuthError) {
    console.error('AuthError details:', {
      code: error.code,
      message: error.message,
      details: error.message // Using message as details since Supabase AuthError doesn't have a details property
    });
  }

  let errorMessage = 'An unexpected error occurred during authentication';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  console.error('Detailed error:', errorMessage);
  throw new Error(`Authentication failed: ${errorMessage}`);
}
