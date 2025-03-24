
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// Mock data - in a real implementation this would come from the API
const mockSubscriptionData = [
  { name: 'Jan', monthly: 4, annual: 2, total: 6 },
  { name: 'Feb', monthly: 6, annual: 3, total: 9 },
  { name: 'Mar', monthly: 8, annual: 4, total: 12 },
  { name: 'Apr', monthly: 12, annual: 6, total: 18 },
  { name: 'May', monthly: 15, annual: 8, total: 23 },
  { name: 'Jun', monthly: 18, annual: 10, total: 28 },
];

const mockEngagementData = [
  { name: 'Mon', users: 45, exams: 32, games: 28 },
  { name: 'Tue', users: 52, exams: 38, games: 30 },
  { name: 'Wed', users: 49, exams: 30, games: 25 },
  { name: 'Thu', users: 53, exams: 39, games: 32 },
  { name: 'Fri', users: 57, exams: 42, games: 35 },
  { name: 'Sat', users: 60, exams: 45, games: 40 },
  { name: 'Sun', users: 65, exams: 48, games: 42 },
];

export const AdminStats = () => {
  const [chartTab, setChartTab] = useState("subscriptions");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center bg-blue-50">
          <h3 className="text-lg font-medium text-blue-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-800">245</p>
          <p className="text-sm text-blue-600">+12% from last month</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center bg-green-50">
          <h3 className="text-lg font-medium text-green-700">Active Subscriptions</h3>
          <p className="text-3xl font-bold text-green-800">128</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center bg-purple-50">
          <h3 className="text-lg font-medium text-purple-700">Tests Completed</h3>
          <p className="text-3xl font-bold text-purple-800">1,876</p>
          <p className="text-sm text-purple-600">+15% from last month</p>
        </Card>
      </div>
      
      <div>
        <Tabs value={chartTab} onValueChange={setChartTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscriptions" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockSubscriptionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="monthly" stackId="a" fill="#8884d8" name="Monthly" />
                  <Bar dataKey="annual" stackId="a" fill="#82ca9d" name="Annual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="mt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockEngagementData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" name="Active Users" />
                  <Line type="monotone" dataKey="exams" stroke="#82ca9d" name="Exams Taken" />
                  <Line type="monotone" dataKey="games" stroke="#ffc658" name="Games Played" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
