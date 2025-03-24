
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarCreator } from "@/components/profile/AvatarCreator";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const subscription = searchParams.get('subscription');

  useEffect(() => {
    if (subscription === 'success') {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing. Your account has been upgraded.",
        variant: "default",
      });
    } else if (subscription === 'canceled') {
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled. No charges were made.",
        variant: "default",
      });
    }
  }, [subscription, toast]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="User avatar" />
              ) : (
                <AvatarFallback>
                  {profile?.name?.charAt(0) || profile?.username?.charAt(0) || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <h3 className="text-xl font-semibold">{profile?.name || "User"}</h3>
            {profile?.username && (
              <p className="text-gray-500">@{profile.username}</p>
            )}
            <p className="mt-2 text-center">{user.email}</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Your current subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="font-medium text-lg">
                {profile?.subscription_tier 
                  ? `${profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)} Plan` 
                  : "Free Plan"}
              </p>
              <p className="text-gray-500">
                {profile?.subscription_status === "active" 
                  ? `Active until ${new Date(profile?.subscription_expires_at || "").toLocaleDateString()}`
                  : "No active subscription"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="avatar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="settings">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="avatar" className="mt-6">
          <AvatarCreator />
        </TabsContent>
        
        <TabsContent value="subscription" className="mt-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Choose Your Subscription</CardTitle>
              <CardDescription>
                Upgrade your account to get full access to all features
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <SubscriptionPlans />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Account settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
