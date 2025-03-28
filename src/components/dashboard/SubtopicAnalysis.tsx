import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { iconMap, type SubtopicPerformance } from "@/types/subtopics";

const getLearningPriority = (score: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  value: number;
} => {
  if (score >= 75) {
    return {
      label: "Master",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      value: 100,
    };
  } else if (score >= 61) {
    return {
      label: "High",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      value: 75,
    };
  } else if (score >= 50) {
    return {
      label: "Medium",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      value: 60,
    };
  } else {
    return {
      label: "Weak",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      value: 40,
    };
  }
};

interface SubtopicAnalysisProps {
  subtopics: SubtopicPerformance[];
  limit?: number;
}

export const SubtopicAnalysis = ({ subtopics, limit }: SubtopicAnalysisProps) => {
  const displaySubtopics = limit ? subtopics.slice(0, limit) : subtopics;

  return (
    <div className="space-y-4">
      {displaySubtopics.map((subtopic) => {
        const priority = getLearningPriority(subtopic.score);
        const Icon = iconMap[subtopic.icon];

        return (
          <div
            key={subtopic.id}
            className={`p-3 border ${priority.borderColor} ${priority.bgColor} rounded-md`}
          >
            <h4 className="font-medium flex items-center gap-2">
              <Icon className={`h-4 w-4 ${priority.color}`} />
              {subtopic.name}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {subtopic.improvement}
            </p>
            <div className="mt-2">
              <div className="text-xs font-medium mb-1 flex justify-between">
                <span>Learning Priority</span>
                <span className={priority.color}>{priority.label}</span>
              </div>
              <Progress
                value={priority.value}
                className={`h-1.5 ${priority.bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}; 