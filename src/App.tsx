import '@fontsource/playfair-display';
import '@fontsource/inter';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminSaveProvider } from "./contexts/AdminSaveContext";
import { routes } from "@/routes";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import Navigation from "@/components/Navigation";
import { Favicon } from './components/Favicon';

console.log('App component loading...');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    ),
    children: routes
  }
]);

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
  </div>
);

const App = () => {
  console.log('Rendering App component...');
  
  return (
    <>
      <Favicon />
      <Suspense fallback={<LoadingFallback />}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AdminSaveProvider>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <RouterProvider router={router} />
                <Toaster />
                <Sonner />
              </ThemeProvider>
            </AdminSaveProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Suspense>
    </>
  );
};

export default App;

