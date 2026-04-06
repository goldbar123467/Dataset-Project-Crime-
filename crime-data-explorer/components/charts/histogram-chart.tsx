"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistogramProps {
  data: number[];
  bins?: number;
  height?: number;
  xLabel?: string;
}

function createBins(data: number[], numBins: number) {
  if (data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / numBins;

  const bins = Array.from({ length: numBins }, (_, i) => ({
    range: `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`,
    count: 0,
    rangeStart: min + i * binWidth,
  }));

  for (const val of data) {
    const idx = Math.min(Math.floor((val - min) / binWidth), numBins - 1);
    bins[idx].count++;
  }

  return bins;
}

export function HistogramChart({
  data,
  bins = 20,
  height = 400,
  xLabel = "Value",
}: HistogramProps) {
  const binData = createBins(data, bins);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={binData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="range"
          stroke="hsl(var(--muted-foreground))"
          fontSize={10}
          angle={-45}
          textAnchor="end"
          height={60}
          label={{ value: xLabel, position: "insideBottom", offset: -5 }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          label={{ value: "Count", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            color: "hsl(var(--card-foreground))",
          }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
