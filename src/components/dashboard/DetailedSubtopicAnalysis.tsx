import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubtopicAnalysis } from "./SubtopicAnalysis";
import type { SubtopicPerformance } from "@/types/subtopics";

interface DetailedSubtopicAnalysisProps {
  subtopics: SubtopicPerformance[];
}

export const DetailedSubtopicAnalysis = ({ subtopics }: DetailedSubtopicAnalysisProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cognitive Performance Analysis</CardTitle>
          <CardDescription>
            Comprehensive analysis of your performance across all recent exam subtopics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubtopicAnalysis subtopics={subtopics} />
        </CardContent>
      </Card>
    </div>
  );
}; 