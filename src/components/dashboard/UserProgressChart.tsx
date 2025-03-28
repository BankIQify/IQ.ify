import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

const data = [
  { date: 'Week 1', score: 65 },
  { date: 'Week 2', score: 72 },
  { date: 'Week 3', score: 68 },
  { date: 'Week 4', score: 75 },
  { date: 'Week 5', score: 82 },
  { date: 'Week 6', score: 78 },
  { date: 'Week 7', score: 85 },
  { date: 'Week 8', score: 89 }
];

export const UserProgressChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
          domain={[0, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-2 !bg-background border shadow-lg">
                  <p className="text-sm font-medium">{payload[0].payload.date}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {payload[0].value}%
                  </p>
                </Card>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{
            r: 4,
            fill: "hsl(var(--background))",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2
          }}
          activeDot={{
            r: 6,
            fill: "hsl(var(--primary))",
            stroke: "hsl(var(--background))",
            strokeWidth: 2
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
