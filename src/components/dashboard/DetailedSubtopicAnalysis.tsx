import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SubtopicPerformance } from "@/types/subtopics";

interface DetailedSubtopicAnalysisProps {
  subtopics: SubtopicPerformance[];
  isLoading?: boolean;
}

export const DetailedSubtopicAnalysis = ({ 
  subtopics,
  isLoading = false 
}: DetailedSubtopicAnalysisProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Detailed Cognitive Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subtopics.map((subtopic) => (
            <Card key={subtopic.id}>
              <CardHeader>
                <CardTitle className="text-lg">{subtopic.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Performance</span>
                    <span className="font-medium">{subtopic.score}%</span>
                  </div>
                  <Progress value={subtopic.score} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {subtopic.improvement}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last tested: {subtopic.lastTested}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </div>
  );
}; 