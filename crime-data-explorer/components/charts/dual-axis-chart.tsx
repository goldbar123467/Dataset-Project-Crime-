"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DualAxisChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  leftKey: string;
  leftLabel: string;
  rightKey: string;
  rightLabel: string;
  height?: number;
}

export function DualAxisChart({
  data,
  xKey,
  leftKey,
  leftLabel,
  rightKey,
  rightLabel,
  height = 400,
}: DualAxisChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis
          yAxisId="left"
          stroke="#3b82f6"
          fontSize={12}
          label={{ value: leftLabel, angle: -90, position: "insideLeft", style: { fill: "#3b82f6" } }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#ef4444"
          fontSize={12}
          label={{ value: rightLabel, angle: 90, position: "insideRight", style: { fill: "#ef4444" } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={leftKey}
          name={leftLabel}
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={rightKey}
          name={rightLabel}
          stroke="#ef4444"
          strokeWidth={2}
          dot={false}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
