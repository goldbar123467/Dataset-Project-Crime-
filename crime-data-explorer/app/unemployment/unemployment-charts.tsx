"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChoroplethMap } from "@/components/charts/choropleth-map";
import { HistogramChart } from "@/components/charts/histogram-chart";
import { ChartTableToggle } from "@/components/chart-table-toggle";
import { DataTable } from "@/components/data-table";
import { StateSelect } from "@/components/filters/state-select";
import { MetricPicker } from "@/components/filters/metric-picker";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from "@/lib/utils";

interface UnemploymentChartsProps {
  years: number[];
  states: string[];
  mapValues: Record<string, number>;
  distValues: number[];
  tableData: Record<string, unknown>[];
  selectedYear: number;
}

const tableColumns = [
  { key: "county" as const, label: "County" },
  { key: "state" as const, label: "State" },
  { key: "laborForce" as const, label: "Labor Force", format: (v: unknown) => formatNumber(v as number) },
  { key: "employed" as const, label: "Employed", format: (v: unknown) => formatNumber(v as number) },
  { key: "unemployed" as const, label: "Unemployed", format: (v: unknown) => formatNumber(v as number) },
  { key: "unemploymentRate" as const, label: "Rate (%)", format: (v: unknown) => (v as number)?.toFixed(2) ?? "—" },
];

export function UnemploymentCharts({
  years,
  states,
  mapValues,
  distValues,
  tableData,
  selectedYear,
}: UnemploymentChartsProps) {
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

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
              Year
            </label>
            <MetricPicker
              metrics={yearOptions}
              param="year"
              defaultValue={String(selectedYear)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              States
            </label>
            <StateSelect states={states} />
          </div>
        </CardContent>
      </Card>

      {/* Choropleth map */}
      <Card>
        <CardHeader>
          <CardTitle>Average Unemployment Rate by State ({selectedYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <ChoroplethMap
            data={mapValues}
            valueLabel="Unemployment Rate (%)"
            colorScale={["#dcfce7", "#166534"]}
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Histogram */}
      <Card>
        <CardHeader>
          <CardTitle>County Unemployment Rate Distribution ({selectedYear})</CardTitle>
        </CardHeader>
        <CardContent>
          <HistogramChart
            data={distValues}
            bins={25}
            xLabel="Unemployment Rate (%)"
          />
        </CardContent>
      </Card>

      <Separator />

      {/* Data table */}
      <Card>
        <CardHeader>
          <CardTitle>County Data</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tableData}
            columns={tableColumns}
            searchKey="county"
          />
        </CardContent>
      </Card>
    </div>
  );
}
