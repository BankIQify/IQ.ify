
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MONTHLY_PRICE_ID = 'price_monthly'; // Replace with real Stripe price ID
const ANNUAL_PRICE_ID = 'price_annual';   // Replace with real Stripe price ID

export const SubscriptionPlans = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const isSubscribed = profile?.subscription_status === 'active';
  const currentPlan = profile?.subscription_tier;

  const handleSubscription = async (priceId: string, planName: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
      });
      return;
    }

    setLoading(priceId);
    
    try {
      // Get the current URL for success/cancel redirects
      const origin = window.location.origin;
      const successUrl = `${origin}/profile?subscription=success`;
      const cancelUrl = `${origin}/profile?subscription=canceled`;

      // Call the Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          successUrl,
          cancelUrl
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.url) {
        // Redirect to the Stripe Checkout page
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        variant: "destructive",
        title: "Subscription error",
        description: "There was an error starting your subscription. Please try again later.",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Plan */}
      <Card className={`${currentPlan === 'monthly' ? 'border-education-600 border-2' : ''}`}>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Monthly Plan
            {currentPlan === 'monthly' && (
              <span className="bg-education-100 text-education-800 text-xs px-2 py-1 rounded-full">
                Current Plan
              </span>
            )}
          </CardTitle>
          <CardDescription>Pay monthly, cancel anytime</CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">£15</span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Feature text="Full access to all practice tests" />
            <Feature text="Unlimited brain training games" />
            <Feature text="Track your progress over time" />
            <Feature text="Priority customer support" />
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => handleSubscription(MONTHLY_PRICE_ID, 'monthly')}
            disabled={loading !== null || (isSubscribed && currentPlan === 'monthly')}
          >
            {loading === MONTHLY_PRICE_ID 
              ? "Processing..." 
              : isSubscribed && currentPlan === 'monthly'
              ? "Current Plan"
              : "Subscribe Monthly"}
          </Button>
        </CardFooter>
      </Card>

      {/* Annual Plan */}
      <Card className={`${currentPlan === 'annual' ? 'border-education-600 border-2' : ''}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Annual Plan</CardTitle>
            {currentPlan === 'annual' ? (
              <span className="bg-education-100 text-education-800 text-xs px-2 py-1 rounded-full">
                Current Plan
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Save 33%
              </span>
            )}
          </div>
          <CardDescription>Pay yearly for the best value</CardDescription>
          <div className="mt-2">
            <span className="text-3xl font-bold">£120</span>
            <span className="text-muted-foreground">/year</span>
            <div className="text-sm text-green-600 mt-1">Just £10/month</div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <Feature text="Everything in the monthly plan" />
            <Feature text="Save £60 compared to monthly billing" />
            <Feature text="Download practice materials as PDFs" />
            <Feature text="Exclusive annual subscriber content" />
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-education-700 hover:bg-education-800" 
            onClick={() => handleSubscription(ANNUAL_PRICE_ID, 'annual')}
            disabled={loading !== null || (isSubscribed && currentPlan === 'annual')}
          >
            {loading === ANNUAL_PRICE_ID 
              ? "Processing..." 
              : isSubscribed && currentPlan === 'annual'
              ? "Current Plan"
              : "Subscribe Yearly"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2">
    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
    <span>{text}</span>
  </li>
);
