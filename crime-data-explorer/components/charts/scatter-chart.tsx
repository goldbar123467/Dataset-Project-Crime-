"use client";

import {
  ScatterChart as RechartsScatter,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";
import { REGION_COLORS } from "@/lib/constants";

interface ScatterDataPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  region?: string;
}

interface ScatterChartProps {
  data: ScatterDataPoint[];
  xLabel: string;
  yLabel: string;
  height?: number;
}

export function ScatterChartComponent({
  data,
  xLabel,
  yLabel,
  height = 400,
}: ScatterChartProps) {
  const grouped = data.reduce<Record<string, ScatterDataPoint[]>>((acc, d) => {
    const key = d.region ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(d);
    return acc;
  }, {});

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsScatter margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          label={{ value: xLabel, position: "insideBottom", offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          label={{ value: yLabel, angle: -90, position: "insideLeft" }}
        />
        <ZAxis type="number" dataKey="z" range={[40, 400]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value) => [Number(value).toFixed(2)]}
          labelFormatter={(_, payload) => {
            const p = payload?.[0]?.payload as ScatterDataPoint | undefined;
            return p?.name ?? "";
          }}
        />
        <Legend />
        {Object.entries(grouped).map(([region, points]) => (
          <Scatter
            key={region}
            name={region}
            data={points}
            fill={REGION_COLORS[region] ?? "#6366f1"}
            opacity={0.7}
          />
        ))}
      </RechartsScatter>
    </ResponsiveContainer>
  );
}
