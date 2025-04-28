import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AdminSaveProvider } from './contexts/AdminSaveContext';
import { AppLayout } from './components/layout/AppLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { DataInputProtectedRoute } from './components/DataInputProtectedRoute';
import { Favicon } from './components/Favicon';
import Navigation from "@/components/Navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { routes } from "@/routes";
import { LoadingFallback } from "./components/ui/loading";
import { queryClient } from "./lib/queryClient";

// Lazy load feature-specific components
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Admin = lazy(() => import('./pages/Admin'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));
const ManageContent = lazy(() => import('./pages/ManageContent'));
const ManageSettings = lazy(() => import('./pages/ManageSettings'));
const ManageSubscription = lazy(() => import('./pages/subscription/ManageSubscription'));
const QuestionBank = lazy(() => import('./pages/QuestionBank'));
const SubjectProgress = lazy(() => import('./pages/SubjectProgress'));
const IQTestGame = lazy(() => import('./components/games/IQTestGame'));

function App() {
  return (
    <Favicon />
    <AuthProvider>
      <AdminSaveProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/question-bank" element={<QuestionBank />} />
                    <Route path="/subject-progress" element={<SubjectProgress />} />
                    <Route path="/games/iq-test" element={<IQTestGame difficulty="easy" />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminProtectedRoute />}>
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/users" element={<ManageUsers />} />
                    <Route path="/admin/content" element={<ManageContent />} />
                    <Route path="/admin/settings" element={<ManageSettings />} />
                  </Route>

                  {/* Subscription Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/subscription" element={<ManageSubscription />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </AdminSaveProvider>
    </AuthProvider>
  );
}

export default App;
