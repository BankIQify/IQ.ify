import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

export function TrialSignup() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartTrial = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        toast({
          title: 'Please sign in',
          description: 'You need to be signed in to start your trial.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1RAE3f2Q67U6CAuLC5a3rnPD', // Annual plan price ID
          successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`,
          trial: true
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="relative p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Free Trial Today!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Get full access to all features for 7 days, completely free.
          </p>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-4xl font-bold text-primary mb-2">100+</span>
              <span className="text-sm text-muted-foreground">Practice Tests</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-4xl font-bold text-primary mb-2">24/7</span>
              <span className="text-sm text-muted-foreground">Support Access</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-4xl font-bold text-primary mb-2">∞</span>
              <span className="text-sm text-muted-foreground">Brain Games</span>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-muted/30 p-4 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground">
              No commitment required. Cancel anytime during your trial and you won't be charged.
              After your trial, continue with our annual plan for just £120/year (£10/month).
            </p>
          </div>

          <Button
            size="lg"
            className="w-full md:w-auto md:px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleStartTrial}
            disabled={isLoading}
          >
            {isLoading ? "Starting your trial..." : "Start Your 7-Day Free Trial"}
          </Button>
        </div>
      </Card>
    </div>
  );
} 