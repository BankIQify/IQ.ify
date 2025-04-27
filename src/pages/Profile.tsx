import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AvatarCreator from "@/components/profile/AvatarCreator";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { Navigate, useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const subscription = searchParams.get('subscription');
  const sessionId = searchParams.get('session_id');
  const activeTab = searchParams.get('tab') || 'subscription';

  useEffect(() => {
    if (sessionId) {
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
  }, [sessionId, subscription, toast]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Determine display name
  const displayName = profile?.name || profile?.username || user.email?.split('@')[0] || "Scholar";

  const handleTabChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', value);
      return newParams;
    });
  };

  const handleUpdateProfile = async (data: any) => {
    try {
      await updateProfile(data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            {profile?.subscription_status === 'active' && profile?.subscription_tier === 'pro' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 right-0 -mt-4 -mr-4 z-10"
              >
                <div className="relative">
                  {/* Ribbon Background */}
                  <div className="absolute -left-4 -top-4 w-24 h-24 bg-yellow-400/20 transform rotate-45 rounded-full blur-lg"></div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-400/20 transform rotate-45 rounded-full blur-lg"></div>

                  {/* Ribbon */}
                  <div className="relative bg-yellow-400 text-white px-6 py-2 rounded-full shadow-lg">
                    <div className="text-sm font-bold">PRO</div>
                  </div>

                  {/* Trophy Icon */}
                  <div className="absolute -left-2 -top-2 transform rotate-45">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M12 2L14.293 5.293L17.586 2L22 7L19.414 9.586L21.707 13L24 15.293L19.414 20.886L17.586 23L12 18L6.414 23L4.586 20.886L0 15.293L2.293 13L4.586 9.586L1.914 7L6.414 2L8.707 5.293L12 2z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Ribbon Ends */}
                  <div className="absolute -right-2 -bottom-2 transform rotate-45">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="User avatar" />
                ) : (
                  <AvatarFallback className="bg-[#00FF7F] text-white">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome, {displayName}!</h1>
                <p className="text-gray-600">
                  {profile?.bio || "Edit your profile to add a bio"}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleUpdateProfile({ username: "new_username" })}
              >
                Edit Profile
              </Button>
              <Button 
                variant="default" 
                size="lg"
                onClick={() => handleUpdateProfile({ bio: "new_bio" })}
              >
                Update Bio
              </Button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Practice Sessions</h3>
                <div className="text-3xl font-bold">{profile?.practice_sessions || 0}</div>
                <p className="text-gray-600">Total practice sessions completed</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Correct Answers</h3>
                <div className="text-3xl font-bold">{profile?.correct_answers || 0}</div>
                <p className="text-gray-600">Total correct answers</p>
              </div>
              <div className="p-4 bg-white/10 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Time Spent</h3>
                <div className="text-3xl font-bold">{profile?.time_spent || 0}h</div>
                <p className="text-gray-600">Total time spent learning</p>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="avatar">Avatar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    {profile?.subscription_status === 'active' ? (
                      <span className="text-green-600 font-medium">
                        Active Subscription
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-medium">
                        Trial Period
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionPlans />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="avatar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Your Avatar</CardTitle>
                  <CardDescription>
                    Create and customize your unique IQify avatar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarCreator 
                    avatarConfig={profile?.avatar_config || {}}
                    onConfigChange={(config) => handleUpdateProfile({ avatar_config: config })}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
