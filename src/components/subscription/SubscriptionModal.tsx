import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RADwr2Q67U6CAuLlNfyRpD5hlhFLO3XtLPH2Sc8BqIClrvMwLlomSfSAYeZGzsN4oqclM0L4XT2qHJFhKNlGIzj00yd1bQWyv');

// Price IDs from your Stripe dashboard
const MONTHLY_PRICE_ID = 'price_1RAE6l2Q67U6CAuLVI3uGCuu';
const ANNUAL_PRICE_ID = 'price_1RAE3f2Q67U6CAuLC5a3rnPD';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: isAnnual ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID,
          successUrl: `${window.location.origin}/profile?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`,
          paymentMethods: ['card', 'apple_pay', 'google_pay', 'paypal'],
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Continue Your Premium Access
          </DialogTitle>
          <DialogDescription className="text-center">
            Your free trial has ended. Choose your preferred payment plan to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <div className="flex justify-center items-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
              Annual (Save 33%)
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isAnnual ? 'annual' : 'monthly'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-muted/30 p-6 rounded-lg text-center"
            >
              <div className="text-4xl font-bold mb-2">
                {isAnnual ? '£120' : '£15'}
                <span className="text-lg text-muted-foreground">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <div className="text-sm text-green-600 mb-4">
                  Just £10/month, billed annually
                </div>
              )}
              <ul className="text-sm space-y-2 mb-6">
                <li>✓ Full access to all practice tests</li>
                <li>✓ Unlimited brain training games</li>
                <li>✓ Detailed performance analytics</li>
                <li>✓ Priority customer support</li>
                {isAnnual && <li>✓ Exclusive annual subscriber content</li>}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-4">
            <Button
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSubscribe}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Continue with ${isAnnual ? 'Annual' : 'Monthly'} Plan`}
            </Button>

            <div className="flex justify-center gap-4">
              <img src="/payment-methods/visa.svg" alt="Visa" className="h-8" />
              <img src="/payment-methods/mastercard.svg" alt="Mastercard" className="h-8" />
              <img src="/payment-methods/apple-pay.svg" alt="Apple Pay" className="h-8" />
              <img src="/payment-methods/google-pay.svg" alt="Google Pay" className="h-8" />
              <img src="/payment-methods/paypal.svg" alt="PayPal" className="h-8" />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 