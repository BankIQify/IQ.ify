
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Award, Brain, Target, TrendingUp, User, Users, BarChart, PieChart, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { UserProgressChart } from "@/components/dashboard/UserProgressChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UserBadges } from "@/components/dashboard/UserBadges";
import { AchievementsSummary } from "@/components/dashboard/AchievementsSummary";
import { LearningRecommendations } from "@/components/dashboard/LearningRecommendations";
import { AdminUsersList } from "@/components/dashboard/admin/AdminUsersList";
import { AdminStats } from "@/components/dashboard/admin/AdminStats";

const Dashboard = () => {
  const { user, profile, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      toast({
        title: "Access Denied",
        description: "You must be logged in to access the Dashboard.",
        variant: "destructive"
      });
      navigate("/auth");
    }
  }, [user, navigate, toast]);

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="page-container max-w-6xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.name || profile.username || "Scholar"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="font-medium">
              {profile.subscription_tier 
                ? `${profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)} Plan` 
                : "Free Plan"}
            </span>
            <span className="text-sm text-muted-foreground">
              {profile.subscription_status === "active" 
                ? `Active until ${new Date(profile.subscription_expires_at || "").toLocaleDateString()}`
                : "No active subscription"}
            </span>
          </div>
          
          <Link to="/profile">
            <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt="User avatar" />
              ) : (
                <AvatarFallback>
                  {profile.name?.charAt(0) || profile.username?.charAt(0) || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </Link>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="text-xl">
                        {profile.name?.charAt(0) || profile.username?.charAt(0) || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h3 className="font-semibold text-xl">{profile.name || "User"}</h3>
                  {profile.username && <p className="text-muted-foreground">@{profile.username}</p>}
                  
                  <div className="mt-4 w-full">
                    <Link to="/profile">
                      <Button variant="outline" className="w-full">
                        Edit Profile & Avatar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <RecentActivity />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Link to="/lets-practice">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span>Practice Tests</span>
                  </Button>
                </Link>
                
                <Link to="/brain-training">
                  <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <span>Brain Games</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <LearningRecommendations />
          </div>
        </TabsContent>

        {/* Progress Tab Content */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your improvement over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <UserProgressChart />
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Skill Breakdown</CardTitle>
                  <CardDescription>Areas of strength and improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Verbal Reasoning</span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Non-Verbal Reasoning</span>
                        <span className="font-medium">62%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: "62%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Mathematical Reasoning</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Problem Solving</span>
                        <span className="font-medium">71%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "71%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Test Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Verbal Reasoning Practice", score: 85, date: "2 days ago" },
                    { name: "Non-Verbal Pattern Test", score: 72, date: "5 days ago" },
                    { name: "Mathematical Reasoning", score: 90, date: "1 week ago" },
                    { name: "Complete Practice Exam", score: 82, date: "2 weeks ago" }
                  ].map((test, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                      </div>
                      <div className="text-lg font-semibold">{test.score}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Focus Areas</CardTitle>
                <CardDescription>
                  AI-driven suggestions based on your performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-amber-200 bg-amber-50 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-600" />
                      Pattern Recognition
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your performance indicates you could benefit from additional practice 
                      with sequence and pattern recognition problems.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      Vocabulary Extension
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider focusing on enriching your vocabulary to improve verbal 
                      reasoning performance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab Content */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserBadges />
            <AchievementsSummary />
          </div>
        </TabsContent>

        {/* Admin Tab Content */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Site Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminStats />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminUsersList />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      User Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/manage-questions">
                          <PieChart className="h-4 w-4 mr-2" />
                          Question Management
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Manage User Permissions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Link to="/manage-questions">
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="h-4 w-4 mr-2" />
                          Puzzle Management
                        </Button>
                      </Link>
                      <Link to="/manage-questions">
                        <Button variant="outline" className="w-full justify-start">
                          <Award className="h-4 w-4 mr-2" />
                          Update Homepage
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Dashboard;
