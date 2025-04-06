import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SubscriptionModal } from '@/components/subscription/SubscriptionModal';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    if (user && profile) {
      const trialEndDate = new Date(profile.subscription_expires_at || '');
      const now = new Date();

      // Show modal if trial has ended and user doesn't have an active subscription
      if (trialEndDate < now && profile.subscription_status !== 'active') {
        setShowSubscriptionModal(true);
      }
    }
  }, [user, profile]);

  return (
    <>
      {children}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
} 