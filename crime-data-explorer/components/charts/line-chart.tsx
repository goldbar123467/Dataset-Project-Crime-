"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants";

interface LineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: { key: string; label: string; dashed?: boolean }[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
}

export function LineChartComponent({
  data,
  xKey,
  yKeys,
  height = 400,
  colors = CHART_COLORS,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xKey}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Legend />
        {yKeys.map((yk, i) => (
          <Line
            key={yk.key}
            type="monotone"
            dataKey={yk.key}
            name={yk.label}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            strokeDasharray={yk.dashed ? "5 5" : undefined}
            dot={false}
            connectNulls
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
