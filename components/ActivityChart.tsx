
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ActivityChartProps {
  data: Array<{ name: string; value: number }>;
  className?: string;
}

const ActivityChart = ({ data, className }: ActivityChartProps) => {
  return (
    <Card className={cn(
      "p-6 backdrop-blur-sm bg-white/80 border border-white/20 shadow-lg animate-fade-in",
      className
    )}>
      <h3 className="text-lg font-semibold mb-4 text-health-navy">Activity Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="#718096"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="#718096"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4FD1C5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: "#4FD1C5" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ActivityChart;
