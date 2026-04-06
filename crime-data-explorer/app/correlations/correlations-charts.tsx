"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChartComponent } from "@/components/charts/scatter-chart";
import { DualAxisChart } from "@/components/charts/dual-axis-chart";
import { YearSlider } from "@/components/filters/year-slider";
import { Separator } from "@/components/ui/separator";

interface CorrelationsChartsProps {
  scatterData: { x: number; y: number; z: number; name: string; region: string }[];
  trendData: { year: number; incarcerationRate: number; unemploymentRate: number }[];
}

export function CorrelationsCharts({
  scatterData,
  trendData,
}: CorrelationsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Year Range (2007–2016)
            </label>
            <YearSlider min={2007} max={2016} />
          </div>
        </CardContent>
      </Card>

      {/* Scatter plot */}
      <Card>
        <CardHeader>
          <CardTitle>Unemployment Rate vs. Violent Crime Rate by State</CardTitle>
          <p className="text-sm text-muted-foreground">
            Bubble size represents state population. Colors represent census regions.
          </p>
        </CardHeader>
        <CardContent>
          <ScatterChartComponent
            data={scatterData}
            xLabel="Avg Unemployment Rate (%)"
            yLabel="Avg Violent Crime Rate (per 100K)"
            height={500}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Paired trend lines */}
      <Card>
        <CardHeader>
          <CardTitle>National Incarceration Rate vs. Unemployment Rate</CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregated trends across the 2007–2016 overlap period
          </p>
        </CardHeader>
        <CardContent>
          <DualAxisChart
            data={trendData}
            xKey="year"
            leftKey="incarcerationRate"
            leftLabel="Incarceration Rate (per 100K)"
            rightKey="unemploymentRate"
            rightLabel="Unemployment Rate (%)"
          />
        </CardContent>
      </Card>
    </div>
  );
}
