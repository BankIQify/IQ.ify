import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: any; // TODO: Properly type the user object
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">IQ.ify</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Welcome, {user.email}</span>
        </div>
      </div>
    </header>
  );
};
