import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const progressData = [
  { month: "Jan", verbal: 65, nonVerbal: 50, brainTraining: 45, average: 53 },
  { month: "Feb", verbal: 68, nonVerbal: 55, brainTraining: 52, average: 58 },
  { month: "Mar", verbal: 70, nonVerbal: 62, brainTraining: 60, average: 64 },
  { month: "Apr", verbal: 73, nonVerbal: 68, brainTraining: 65, average: 69 },
  { month: "May", verbal: 76, nonVerbal: 72, brainTraining: 70, average: 73 },
  { month: "Jun", verbal: 80, nonVerbal: 75, brainTraining: 78, average: 78 },
];

const timeRanges = [
  { value: "6months", label: "Last 6 Months" },
  { value: "3months", label: "Last 3 Months" },
  { value: "1month", label: "Last Month" },
  { value: "all", label: "All Time" },
];

export const UserProgressChart = () => {
  const [timeRange, setTimeRange] = useState("6months");

  // Filter data based on selected time range
  const filteredData = (() => {
    switch (timeRange) {
      case "3months":
        return progressData.slice(-3);
      case "1month":
        return progressData.slice(-1);
      case "all":
      case "6months":
      default:
        return progressData;
    }
  })();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis 
              dataKey="month" 
              className="text-xs text-muted-foreground"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              domain={[0, 100]} 
              className="text-xs text-muted-foreground"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <Card className="p-2 !bg-background/95 border shadow-lg backdrop-blur">
                      <p className="text-sm font-medium">{payload[0].payload.month}</p>
                      {payload.map((entry) => (
                        <p key={entry.name} className="text-sm text-muted-foreground">
                          {entry.name}: {entry.value}%
                        </p>
                      ))}
                    </Card>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="verbal"
              stroke="#3b82f6"
              name="Verbal Reasoning"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "hsl(var(--background))",
                stroke: "#3b82f6",
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
            />
            <Line
              type="monotone"
              dataKey="nonVerbal"
              stroke="#10b981"
              name="Non-Verbal Reasoning"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "hsl(var(--background))",
                stroke: "#10b981",
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
            />
            <Line
              type="monotone"
              dataKey="brainTraining"
              stroke="#8b5cf6"
              name="Brain Training"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "hsl(var(--background))",
                stroke: "#8b5cf6",
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: "#8b5cf6",
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#6b7280"
              name="Overall Average"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{
                r: 4,
                fill: "hsl(var(--background))",
                stroke: "#6b7280",
                strokeWidth: 2
              }}
              activeDot={{
                r: 6,
                fill: "#6b7280",
                stroke: "hsl(var(--background))",
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
