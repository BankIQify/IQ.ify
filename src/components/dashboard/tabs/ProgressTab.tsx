import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserProgressChart } from "@/components/dashboard/UserProgressChart";
import { Target, Brain, BookOpen, Gauge, Lightbulb, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { SubtopicAnalysis } from "@/components/dashboard/SubtopicAnalysis";
import { DetailedSubtopicAnalysis } from "@/components/dashboard/DetailedSubtopicAnalysis";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSubtopicPerformance } from "@/hooks/useSubtopicPerformance";
import { motion } from "framer-motion";

const MotionCard = motion.create(Card);

export const ProgressTab = () => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const { data: subtopics = [], isLoading } = useSubtopicPerformance('custom');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MotionCard variants={cardVariants} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
                <CardTitle className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Your Progress Journey
                </CardTitle>
              </div>
              <CardDescription className="text-blue-600/80">
                Track your improvements over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <UserProgressChart />
            </CardContent>
          </MotionCard>
        </div>
        
        <div className="lg:col-span-1">
          <MotionCard variants={cardVariants} className="h-full hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                Skills Breakdown
              </CardTitle>
              <CardDescription className="text-slate-600">
                Areas of strength and room for growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubtopicAnalysis 
                subtopics={subtopics} 
                isLoading={isLoading}
                onViewDetails={() => setShowDetailedAnalysis(true)}
              />
            </CardContent>
          </MotionCard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MotionCard variants={cardVariants} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              Recent Assessment Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Verbal Reasoning Practice", score: 85, date: "2 days ago" },
                { name: "Non-Verbal Pattern Test", score: 72, date: "5 days ago" },
                { name: "Mathematical Reasoning", score: 90, date: "1 week ago" },
                { name: "Complete Practice Exam", score: 82, date: "2 weeks ago" }
              ].map((test, i) => (
                <motion.div 
                  key={i} 
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.date}</p>
                  </div>
                  <div className="text-lg font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {test.score}%
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </MotionCard>
        
        <MotionCard variants={cardVariants} className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Smarter Paths to Success
            </CardTitle>
            <CardDescription className="text-blue-600/80">
              Get tailored study suggestions that grow with you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div 
                className="p-4 border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/30 rounded-md hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-amber-600" />
                  Pattern Recognition
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your performance suggests additional practice with sequence and pattern recognition would be beneficial.
                </p>
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Learning Priority</span>
                    <span>High</span>
                  </div>
                  <Progress value={80} className="h-1.5 bg-amber-100" />
                </div>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-md hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  Vocabulary Enhancement
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
              </motion.div>

              <motion.div 
                className="p-4 border border-green-200 bg-gradient-to-r from-green-50 to-green-100/30 rounded-md hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  Memory Techniques
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your recent memory game scores, try these specialised memory techniques to improve retention.
                </p>
                <div className="mt-2">
                  <div className="text-xs font-medium mb-1 flex justify-between">
                    <span>Learning Priority</span>
                    <span>Medium</span>
                  </div>
                  <Progress value={50} className="h-1.5 bg-green-100" />
                </div>
              </motion.div>
            </div>
          </CardContent>
        </MotionCard>
      </div>

      <MotionCard variants={cardVariants} className="hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Personalised Learning Path
          </CardTitle>
          <CardDescription className="text-purple-600/80">
            Customised study plan based on your strengths and areas for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full shadow-md">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Your Learning Style: Visual-Logical</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your performance patterns, you learn best with visual aids and logical problem-solving approaches.
                </p>
              </div>
            </motion.div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Weekly Study Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: <Gauge className="h-4 w-4 text-blue-500" />,
                    days: "Monday & Wednesday",
                    text: "Focus on verbal reasoning and vocabulary building (45 min)",
                    color: "from-blue-50 to-blue-100/30"
                  },
                  {
                    icon: <TrendingUp className="h-4 w-4 text-green-500" />,
                    days: "Tuesday & Thursday",
                    text: "Non-verbal reasoning and pattern recognition (30 min)",
                    color: "from-green-50 to-green-100/30"
                  },
                  {
                    icon: <Zap className="h-4 w-4 text-amber-500" />,
                    days: "Friday",
                    text: "Problem-solving skills with mathematical reasoning (40 min)",
                    color: "from-amber-50 to-amber-100/30"
                  },
                  {
                    icon: <Brain className="h-4 w-4 text-purple-500" />,
                    days: "Weekend",
                    text: "Practice tests and brain training games (Flexible)",
                    color: "from-purple-50 to-purple-100/30"
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    className={`p-4 border rounded-md hover:shadow-md transition-all bg-gradient-to-r ${item.color}`}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                      <h5 className="font-medium">{item.days}</h5>
                    </div>
                    <p className="text-sm">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </MotionCard>

      <Dialog open={showDetailedAnalysis} onOpenChange={setShowDetailedAnalysis}>
        <DialogContent className="max-w-4xl">
          <DetailedSubtopicAnalysis 
            subtopics={subtopics} 
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
