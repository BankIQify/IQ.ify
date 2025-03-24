
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserProgressChart } from "@/components/dashboard/UserProgressChart";
import { Target } from "lucide-react";

export const ProgressTab = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
