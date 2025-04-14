import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import App from './App';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Safari-specific fixes
if (!window.globalThis) {
  (window as any).globalThis = window;
}

// Add global error handler with Safari-specific error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Safari sometimes doesn't include the error object
  if (!event.error && event.message) {
    console.error('Error message:', event.message);
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Safari sometimes provides the reason in a different format
  if (event.reason?.stack) {
    console.error('Error stack:', event.reason.stack);
  }
});

console.log('Starting application...', {
  userAgent: window.navigator.userAgent,
  isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const container = document.getElementById('root');

if (container) {
  console.log('Found root element, rendering app...');
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider defaultTheme="light" storageKey="IQify-theme">
                <TooltipProvider>
                  <App />
                </TooltipProvider>
              </ThemeProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
        <Toaster />
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    // Safari-specific error handling
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
} else {
  console.error("❌ Couldn't find #root element in index.html");
}
