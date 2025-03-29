import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserProgressChart } from "@/components/dashboard/UserProgressChart";
import { Target, Brain, BookOpen, Gauge, Lightbulb, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SubtopicAnalysis } from "@/components/dashboard/SubtopicAnalysis";
import { DetailedSubtopicAnalysis } from "@/components/dashboard/DetailedSubtopicAnalysis";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSubtopicPerformance } from "@/hooks/useSubtopicPerformance";

export const ProgressTab = () => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const { data: subtopics = [], isLoading } = useSubtopicPerformance('custom');

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
              <SubtopicAnalysis 
                subtopics={subtopics} 
                isLoading={isLoading}
                onViewDetails={() => setShowDetailedAnalysis(true)}
              />
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
            <CardTitle>AI-Driven Insights</CardTitle>
            <CardDescription>
              Personalized learning recommendations based on your performance
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
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Learning Priority</span>
                    <span>High</span>
                  </div>
                  <Progress value={80} className="h-1.5 bg-amber-100" />
                </div>
              </div>
              
              <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Vocabulary Extension
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider focusing on enriching your vocabulary to improve verbal 
                  reasoning performance.
                </p>
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Learning Priority</span>
                    <span>Medium</span>
                  </div>
                  <Progress value={60} className="h-1.5 bg-blue-100" />
                </div>
              </div>

              <div className="p-3 border border-green-200 bg-green-50 rounded-md">
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  Memory Techniques
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your recent memory game scores, try these specialized memory techniques to improve retention.
                </p>
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Learning Priority</span>
                    <span>Medium</span>
                  </div>
                  <Progress value={50} className="h-1.5 bg-green-100" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personalized Learning Path</CardTitle>
          <CardDescription>
            AI-generated study plan based on your strengths and weaknesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Your Learning Style: Visual-Logical</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your performance patterns, you learn best with visual aids and logical problem-solving approaches.
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Weekly Study Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <h5 className="font-medium">Monday & Wednesday</h5>
                  </div>
                  <p className="text-sm">Focus on verbal reasoning and vocabulary building (45 min)</p>
                </div>
                
                <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <h5 className="font-medium">Tuesday & Thursday</h5>
                  </div>
                  <p className="text-sm">Non-verbal reasoning and pattern recognition (30 min)</p>
                </div>
                
                <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <h5 className="font-medium">Friday</h5>
                  </div>
                  <p className="text-sm">Problem-solving skills with mathematical reasoning (40 min)</p>
                </div>
                
                <div className="p-3 border rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <h5 className="font-medium">Weekend</h5>
                  </div>
                  <p className="text-sm">Practice tests and brain training games (Flexible)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailedAnalysis} onOpenChange={setShowDetailedAnalysis}>
        <DialogContent className="max-w-4xl">
          <DetailedSubtopicAnalysis 
            subtopics={subtopics} 
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
