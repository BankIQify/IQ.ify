
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const progressData = [
  { month: "Jan", verbal: 65, nonVerbal: 50, average: 58 },
  { month: "Feb", verbal: 68, nonVerbal: 55, average: 62 },
  { month: "Mar", verbal: 70, nonVerbal: 62, average: 66 },
  { month: "Apr", verbal: 73, nonVerbal: 68, average: 71 },
  { month: "May", verbal: 76, nonVerbal: 72, average: 74 },
  { month: "Jun", verbal: 80, nonVerbal: 75, average: 78 },
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="verbal"
              stroke="#8884d8"
              name="Verbal Reasoning"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="nonVerbal"
              stroke="#82ca9d"
              name="Non-Verbal Reasoning"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#ff7300"
              name="Overall Average"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
