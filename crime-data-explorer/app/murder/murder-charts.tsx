"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/charts/line-chart";
import { ChartTableToggle } from "@/components/chart-table-toggle";
import { DataTable } from "@/components/data-table";
import { YearSlider } from "@/components/filters/year-slider";
import { StateSelect } from "@/components/filters/state-select";
import { REGIONS, REGION_COLORS } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface MurderChartsProps {
  regionChartData: Record<string, unknown>[];
  regionYKeys: { key: string; label: string; dashed?: boolean }[];
  regionColors: string[];
  smallMultiples: Record<string, { year: number; deathPenalty: number; noDeathPenalty: number }[]>;
  divergenceData: { year: number; difference: number }[];
  tableData: Record<string, unknown>[];
}

const tableColumns = [
  { key: "region" as const, label: "Region" },
  { key: "state" as const, label: "State" },
  { key: "year" as const, label: "Year" },
  { key: "deathPenaltyStatus" as const, label: "Death Penalty" },
  { key: "murderRate" as const, label: "Murder Rate", format: (v: unknown) => (v as number)?.toFixed(2) ?? "—" },
];

export function MurderCharts({
  regionChartData,
  regionYKeys,
  regionColors,
  smallMultiples,
  divergenceData,
  tableData,
}: MurderChartsProps) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Year Range
            </label>
            <YearSlider min={1987} max={2020} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Regions
            </label>
            <StateSelect
              states={[...REGIONS]}
              param="regions"
              label="Region"
            />
          </div>
        </CardContent>
      </Card>

      {/* Region trend */}
      <Card>
        <CardHeader>
          <CardTitle>Murder Rate by Region Over Time (per 100K)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartTableToggle
            chart={
              <LineChartComponent
                data={regionChartData}
                xKey="year"
                yKeys={regionYKeys}
                colors={regionColors}
              />
            }
            table={
              <DataTable
                data={tableData}
                columns={tableColumns}
                searchKey="state"
              />
            }
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Small multiples: death penalty vs no death penalty */}
      <Card>
        <CardHeader>
          <CardTitle>Death Penalty vs. No Death Penalty Average Murder Rate by Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(smallMultiples).map(([region, data]) => (
              <Card key={region} className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm" style={{ color: REGION_COLORS[region] }}>
                    {region}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChartComponent
                    data={data}
                    xKey="year"
                    yKeys={[
                      { key: "deathPenalty", label: "Death Penalty" },
                      { key: "noDeathPenalty", label: "No Death Penalty" },
                    ]}
                    height={200}
                    colors={["#ef4444", "#3b82f6"]}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Divergence chart */}
      <Card>
        <CardHeader>
          <CardTitle>Murder Rate Divergence (Death Penalty - No Death Penalty)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={divergenceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
              <Bar
                dataKey="difference"
                fill="#a855f7"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Positive = death penalty states have higher murder rates
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
