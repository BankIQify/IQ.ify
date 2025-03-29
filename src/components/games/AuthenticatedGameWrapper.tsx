import { ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthenticatedGameWrapperProps {
  children: ReactNode;
}

export const AuthenticatedGameWrapper = ({ children }: AuthenticatedGameWrapperProps) => {
  const { user } = useAuth();

  useEffect(() => {
    const checkAuthState = async () => {
      console.log('AuthenticatedGameWrapper - Checking auth state...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return;
      }
      
      console.log('AuthenticatedGameWrapper - Auth state:', {
        hasUser: !!user,
        hasSession: !!session,
        sessionUserId: session?.user?.id,
        hookUserId: user?.id,
      });
    };

    checkAuthState();
  }, [user]);

  if (!user) {
    console.log('AuthenticatedGameWrapper - No user found, showing login screen');
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <Card className="w-full border-none shadow-lg overflow-hidden bg-gradient-to-br from-white to-pastel-gray/20">
          <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Login Required
            </h2>
            <p className="text-gray-600 max-w-md">
              To access this game and track your progress, please log in or create an account.
              Your scores and achievements will be saved automatically!
            </p>
            <Button 
              onClick={() => {
                console.log('AuthenticatedGameWrapper - Redirecting to auth page');
                window.location.href = '/auth';
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Login or Sign Up
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  console.log('AuthenticatedGameWrapper - User authenticated, rendering game');
  return <>{children}</>;
}; 