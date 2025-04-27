import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface NavigationProps {
  isDataInput: boolean;
  isAdmin: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isDataInput, isAdmin }) => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();

  return (
    <nav className="flex h-16 items-center bg-gray-800 text-white">
      <div className="flex-1 ml-4">
        <RouterLink to="/dashboard" className="text-xl font-bold">
          IQ.ify
        </RouterLink>
      </div>
      
      <div className="flex items-center space-x-4 mr-4">
        {isDataInput && (
          <RouterLink to="/data-input" className="text-gray-300 hover:text-white">
            Data Input
          </RouterLink>
        )}
        {isAdmin && (
          <RouterLink to="/admin" className="text-gray-300 hover:text-white">
            Admin
          </RouterLink>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button
          variant="outline"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </div>
    </nav>
  );
};
