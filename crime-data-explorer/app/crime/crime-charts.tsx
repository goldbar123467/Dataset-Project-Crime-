"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DualAxisChart } from "@/components/charts/dual-axis-chart";
import { ChoroplethMap } from "@/components/charts/choropleth-map";
import { ChartTableToggle } from "@/components/chart-table-toggle";
import { DataTable } from "@/components/data-table";
import { YearSlider } from "@/components/filters/year-slider";
import { StateSelect } from "@/components/filters/state-select";
import { MetricPicker } from "@/components/filters/metric-picker";
import { CRIME_METRICS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface CrimeChartsProps {
  states: string[];
  chartData: { year: number; incarcerationRate: number; crimeRate: number }[];
  mapValues: Record<string, number>;
  tableData: Record<string, unknown>[];
  metricLabel: string;
  mapYear: number;
}

const tableColumns = [
  { key: "jurisdiction" as const, label: "State" },
  { key: "year" as const, label: "Year" },
  { key: "prisonerCount" as const, label: "Prisoners", format: (v: unknown) => formatNumber(v as number) },
  { key: "statePopulation" as const, label: "Population", format: (v: unknown) => formatNumber(v as number) },
  { key: "incarcerationRate" as const, label: "Inc. Rate", format: (v: unknown) => (v as number)?.toFixed(2) ?? "—" },
  { key: "violentCrimeTotal" as const, label: "Violent Crime", format: (v: unknown) => formatNumber(v as number) },
  { key: "propertyCrimeTotal" as const, label: "Property Crime", format: (v: unknown) => formatNumber(v as number) },
];

export function CrimeCharts({
  states,
  chartData,
  mapValues,
  tableData,
  metricLabel,
  mapYear,
}: CrimeChartsProps) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Year Range
            </label>
            <YearSlider min={2001} max={2016} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              States
            </label>
            <StateSelect states={states} />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              Crime Metric
            </label>
            <MetricPicker metrics={[...CRIME_METRICS]} defaultValue="violent_crime_total" />
          </div>
        </CardContent>
      </Card>

      {/* Dual-axis chart */}
      <Card>
        <CardHeader>
          <CardTitle>Incarceration Rate vs. {metricLabel} Rate (per 100K)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartTableToggle
            chart={
              <DualAxisChart
                data={chartData}
                xKey="year"
                leftKey="incarcerationRate"
                leftLabel="Incarceration Rate"
                rightKey="crimeRate"
                rightLabel={`${metricLabel} Rate`}
              />
            }
            table={
              <DataTable
                data={tableData as Record<string, unknown>[]}
                columns={tableColumns}
                searchKey="jurisdiction"
              />
            }
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Choropleth map */}
      <Card>
        <CardHeader>
          <CardTitle>{metricLabel} Rate by State ({mapYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ChoroplethMap
            data={mapValues}
            valueLabel={`${metricLabel} Rate per 100K`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
