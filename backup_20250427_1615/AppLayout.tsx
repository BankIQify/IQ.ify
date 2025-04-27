import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { Navigation } from './Navigation';
import { MainContent } from './MainContent';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isDataInput, isAdmin } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <Header user={user} />
      <Navigation isDataInput={isDataInput} isAdmin={isAdmin} />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
};