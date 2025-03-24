
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarCreator } from "@/components/profile/AvatarCreator";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

  // Determine display name
  const displayName = profile?.name || profile?.username || user.email?.split('@')[0] || "Scholar";

  return (
    <div className="page-container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Account</h1>
        <Link to="/avatar-creator">
          <Button variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:bg-blue-100">
            Avatar Creator
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-b from-blue-50 to-purple-50 border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-700">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-md">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="User avatar" />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <h3 className="text-xl font-semibold">{displayName}</h3>
            {profile?.username && (
              <p className="text-gray-500">@{profile.username}</p>
            )}
            <p className="mt-2 text-center">{user.email}</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 bg-gradient-to-b from-green-50 to-teal-50 border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Subscription</CardTitle>
            <CardDescription>Your current subscription plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg mb-4 border border-green-100 shadow-sm">
              <p className="font-medium text-lg text-green-700">
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
      
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-100/30">
          <TabsTrigger value="subscription" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Subscription</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="mt-6">
          <Card className="p-6 bg-gradient-to-b from-green-50 to-teal-50 border-green-100">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-green-700">Choose Your Subscription</CardTitle>
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
          <Card className="bg-gradient-to-b from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-700">Account Settings</CardTitle>
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
