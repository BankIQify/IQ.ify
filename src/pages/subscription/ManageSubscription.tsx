import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function ManageSubscription() {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);

      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId: profile?.subscription_id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will remain active until the end of the current billing period.',
      });
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-playfair mb-4">Manage Subscription</h1>
          <p>Please sign in to manage your subscription.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-playfair mb-6">Manage Subscription</h1>

        {profile?.subscription_status === 'active' ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">
                  {profile.subscription_tier === 'monthly' ? 'Monthly' : 'Annual'} Membership
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{profile.subscription_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next billing date</span>
                <span className="font-medium">
                  {profile.subscription_expires_at
                    ? formatDate(profile.subscription_expires_at)
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2">Cancel Subscription</h3>
              <p className="text-muted-foreground mb-4">
                Your subscription will remain active until the end of the current billing period.
                After that, you'll lose access to premium features.
              </p>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                Cancel Subscription
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p>You don't have an active subscription.</p>
            <Button onClick={() => window.location.href = '/subscription'}>
              View Plans
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 