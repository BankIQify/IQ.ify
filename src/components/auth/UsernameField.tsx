
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const UsernameField = ({ value, onChange, disabled }: UsernameFieldProps) => {
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [alternativeUsernames, setAlternativeUsernames] = useState<string[]>([]);

  // Handle username change and check availability
  const handleUsernameChange = async (value: string) => {
    onChange(value);
    
    if (!value) {
      setUsernameAvailable(true);
      setAlternativeUsernames([]);
      return;
    }
    
    if (value.length < 3) {
      return;
    }

    setCheckingUsername(true);
    try {
      // Check if username exists
      const { data, error } = await supabase
        .rpc('username_exists', { 
          username_to_check: value 
        });
      
      if (error) throw error;
      
      setUsernameAvailable(!data);
      
      if (data) {
        // If username is taken, get alternatives
        const { data: alternatives, error: altError } = await supabase
          .rpc('generate_alternative_usernames', { 
            base_username: value 
          });
          
        if (altError) throw altError;
        setAlternativeUsernames(alternatives || []);
      } else {
        setAlternativeUsernames([]);
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setCheckingUsername(false);
    }
  };

  const selectAlternativeUsername = (alt: string) => {
    onChange(alt);
    setUsernameAvailable(true);
    setAlternativeUsernames([]);
  };

  return (
    <div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Username"
          value={value}
          onChange={(e) => handleUsernameChange(e.target.value)}
          required
          disabled={disabled || checkingUsername}
          aria-label="Username"
          className={!usernameAvailable ? "border-red-500" : ""}
        />
        {checkingUsername && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin h-5 w-5 border-2 border-education-600 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
      {!usernameAvailable && value && (
        <div className="mt-2">
          <p className="text-red-500 text-sm mb-1">Username is already taken. Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {alternativeUsernames.map((alt, idx) => (
              <Button 
                key={idx} 
                type="button" 
                size="sm" 
                variant="outline"
                onClick={() => selectAlternativeUsername(alt)}
              >
                {alt}
              </Button>
            ))}
          </div>
        </div>
      )}
      {value && usernameAvailable && value.length >= 3 && (
        <p className="text-green-500 text-sm mt-1">Username is available!</p>
      )}
    </div>
  );
};
