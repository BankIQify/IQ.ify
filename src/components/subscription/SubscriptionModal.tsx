import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();

  if (!user || !profile) {
    return null;
  }

  const trialEndDate = new Date(profile.subscription_expires_at || '');
  const now = new Date();
  const isTrialExpired = trialEndDate < now;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Subscription Required</DialogTitle>
          <div className="text-gray-600 mb-6">
            Your free trial has expired. Please subscribe to continue using IQify.
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <Button 
            variant="default"
            className="w-full"
            onClick={() => {
              // TODO: Implement subscription flow
              window.open('https://app.iqify.ai/subscription', '_blank');
              onClose();
            }}
          >
            Upgrade to Premium
          </Button>
          <Button 
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Continue with Free Features
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
