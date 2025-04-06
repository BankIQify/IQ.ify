import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const MONTHLY_PRICE_ID = 'price_1RAE6l2Q67U6CAuLVI3uGCuu';
const ANNUAL_PRICE_ID = 'price_1RAE3f2Q67U6CAuLC5a3rnPD';

export default function SubscriptionPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Show trial signup for new users or users who haven't started a trial
  const showTrialSignup = !profile?.subscription_status && !profile?.subscription_expires_at;

  const handleSubscription = async (priceId: string, trial: boolean = false) => {
    try {
      if (!user) {
        toast({
          title: 'Please sign in',
          description: 'You need to be signed in to start your subscription.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`,
          trial,
          paymentMethods: ['card', 'apple_pay', 'google_pay', 'paypal'],
        },
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto py-12 px-4">
        {showTrialSignup ? (
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                  <h1 className="text-4xl font-bold mb-4">Start Your Free Trial Today!</h1>
                  <p className="text-xl text-muted-foreground mb-8">
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
                    onClick={() => handleSubscription(ANNUAL_PRICE_ID, true)}
                  >
                    Start Your 7-Day Free Trial
                  </Button>

                  <div className="mt-8 flex justify-center gap-4">
                    <img src="/payment-methods/visa.svg" alt="Visa" className="h-8" />
                    <img src="/payment-methods/mastercard.svg" alt="Mastercard" className="h-8" />
                    <img src="/payment-methods/apple-pay.svg" alt="Apple Pay" className="h-8" />
                    <img src="/payment-methods/google-pay.svg" alt="Google Pay" className="h-8" />
                    <img src="/payment-methods/paypal.svg" alt="PayPal" className="h-8" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground text-center mb-8">
              Select the plan that best suits your needs
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">Monthly Membership</h3>
                <div className="text-3xl font-bold">£15/month</div>
                <div className="space-y-2">
                  <Feature>Full access to all IQ tests</Feature>
                  <Feature>Detailed performance analytics</Feature>
                  <Feature>Personalised study plans</Feature>
                  <Feature>Progress tracking</Feature>
                </div>
                <Button
                  onClick={() => handleSubscription(MONTHLY_PRICE_ID)}
                  className="w-full"
                >
                  Subscribe Monthly
                </Button>
              </Card>

              <Card className="p-6 space-y-4 border-primary">
                <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                  Best Value
                </div>
                <h3 className="text-2xl font-bold">Annual Membership</h3>
                <div className="text-3xl font-bold">£120/year</div>
                <div className="text-muted-foreground">Save £60 compared to monthly</div>
                <div className="space-y-2">
                  <Feature>Everything in Monthly</Feature>
                  <Feature>Priority support</Feature>
                  <Feature>Early access to new features</Feature>
                  <Feature>Exclusive annual member content</Feature>
                </div>
                <Button
                  onClick={() => handleSubscription(ANNUAL_PRICE_ID)}
                  className="w-full"
                  variant="default"
                >
                  Start Annual Plan
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-primary"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>{children}</span>
    </div>
  );
} 