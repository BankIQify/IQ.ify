import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Price IDs for User plans
const USER_MONTHLY_PRICE_ID = 'price_1QYwXj2eZvKYlo2C0JfX2Z3a';
const USER_ANNUAL_PRICE_ID = 'price_1QYwXj2eZvKYlo2C0JfX2Z3a';

// Price IDs for Pro-User plans
const PRO_MONTHLY_PRICE_ID = 'price_1QYwXj2eZvKYlo2C0JfX2Z3a';
const PRO_ANNUAL_PRICE_ID = 'price_1QYwXj2eZvKYlo2C0JfX2Z3a';

export const SubscriptionPlans: React.FC = () => {
  const { user, profile, isAdmin, isDataInput } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscription = async (priceId: string, isAnnual: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscription`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const Feature: React.FC<{ included: boolean; children: React.ReactNode }> = ({ included, children }) => (
    <div className="flex items-center gap-2">
      {included ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-gray-400" />
      )}
      <span className={included ? 'text-gray-900' : 'text-gray-400'}>{children}</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* User Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>User</CardTitle>
            <CardDescription>Perfect for students and individual learners</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">£15</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">£150</div>
                  <div className="text-sm text-gray-500">/year</div>
                  <div className="text-sm text-green-600">Save 17%</div>
                </div>
              </div>
              <div className="space-y-2">
                <Feature included={true}>Access to basic cognitive training</Feature>
                <Feature included={true}>Progress tracking</Feature>
                <Feature included={true}>Basic analytics</Feature>
                <Feature included={false}>Advanced training modules</Feature>
                <Feature included={false}>Priority support</Feature>
                <Feature included={false}>Custom training plans</Feature>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => handleSubscription(USER_MONTHLY_PRICE_ID, false)}
              disabled={isLoading || profile?.subscription_tier === 'user'}
            >
              {isLoading ? 'Processing...' : profile?.subscription_tier === 'user' ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>

        {/* Pro-User Plan */}
        <Card className="flex flex-col border-primary">
          <CardHeader>
            <CardTitle>Pro-User</CardTitle>
            <CardDescription>For serious learners and professionals</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">£25</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">£210</div>
                  <div className="text-sm text-gray-500">/year</div>
                  <div className="text-sm text-green-600">Save 30%</div>
                </div>
              </div>
              <div className="space-y-2">
                <Feature included={true}>Everything in User plan</Feature>
                <Feature included={true}>Advanced training modules</Feature>
                <Feature included={true}>Priority support</Feature>
                <Feature included={true}>Custom training plans</Feature>
                <Feature included={true}>Detailed analytics</Feature>
                <Feature included={true}>Exclusive content</Feature>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant="default"
              onClick={() => handleSubscription(PRO_MONTHLY_PRICE_ID, false)}
              disabled={isLoading || profile?.subscription_tier === 'pro'}
            >
              {isLoading ? 'Processing...' : profile?.subscription_tier === 'pro' ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      {error && (
        <div className="mt-4 text-center text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};
