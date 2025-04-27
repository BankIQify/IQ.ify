import React from 'react';
import { createBrowserRouter, type RouteObject, Outlet, Navigate } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import { AdminSaveProvider } from "@/contexts/AdminSaveContext";
import { ThemeProvider } from "@/components/theme-provider";

// Layouts
import { AppLayout } from "@/components/layout/AppLayout";

// Route protection
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/auth/AdminProtectedRoute";
import { DataInputProtectedRoute } from "@/components/auth/DataInputProtectedRoute";

// Components
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";
import { Auth } from "@/components/auth/Auth";
import { DataInputPage } from "@/components/data-input/DataInputPage";
import { Dashboard } from "@/components/dashboard/Dashboard";

// Configure React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
});

// Main route configuration
const mainRoute: RouteObject = {
  path: "/",
  element: (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="IQify-theme">
        <HelmetProvider>
          <TooltipProvider>
            <Toaster position="top-right" expand={false} richColors={true} />
            <Outlet />
          </TooltipProvider>
        </HelmetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  ),
  children: [
    {
      path: "auth",
      element: <Auth />
    },
    {
      path: "admin",
      element: (
        <ProtectedRoute>
          <AdminProtectedRoute>
            <AdminSaveProvider>
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            </AdminSaveProvider>
          </AdminProtectedRoute>
        </ProtectedRoute>
      )
    },
    {
      path: "data-input",
      element: (
        <ProtectedRoute>
          <DataInputProtectedRoute>
            <AppLayout>
              <DataInputPage />
            </AppLayout>
          </DataInputProtectedRoute>
        </ProtectedRoute>
      )
    },
    {
      path: "dashboard",
      element: (
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: (
        <Navigate to="/auth" replace />
      )
    }
  ]
};

// Create router
export const routes = createBrowserRouter([mainRoute]);
export const router = routes;

// Export individual routes for testing
export { mainRoute };
