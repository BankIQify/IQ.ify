import { AuthError } from '@supabase/supabase-js';

export function handleAuthError(error: unknown) {
  console.error('Auth error details:', error);
  
  if (error instanceof AuthError) {
    switch (error.status) {
      case 400:
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      case 401:
        throw new Error('Your session has expired. Please sign in again.');
      case 403:
        throw new Error('Access forbidden. Please ensure you have the correct permissions.');
      case 404:
        throw new Error('User not found. Please check your email address.');
      case 422:
        throw new Error('Invalid credentials. Please check your email and password.');
      case 429:
        throw new Error('Too many attempts. Please wait a moment and try again.');
      default:
        throw new Error(`Authentication error: ${error.message}`);
    }
  }
  
  // If it's not an AuthError, try to extract more information
  let errorMessage = 'An unexpected error occurred during authentication';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object') {
    try {
      errorMessage = JSON.stringify(error);
    } catch {
      errorMessage = 'Could not parse error details';
    }
  }
  
  console.error('Detailed error:', errorMessage);
  throw new Error(`Authentication failed: ${errorMessage}`);
} 