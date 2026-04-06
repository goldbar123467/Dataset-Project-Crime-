import { getCrimeData, getCrimeMapData } from "@/db/queries/crime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CRIME_METRICS, STATE_NAME_TO_CODE } from "@/lib/constants";
import { ratePer100k, parseSearchParamArray, parseSearchParamNumber, formatNumber, titleCase } from "@/lib/utils";
import { CrimeCharts } from "./crime-charts";
import type { CrimeIncarceration } from "@/db/schema";

interface CrimeExplorerProps {
  states: string[];
  searchParams: Record<string, string | string[] | undefined>;
}

export async function CrimeExplorer({ states, searchParams }: CrimeExplorerProps) {
  const yearMin = parseSearchParamNumber(searchParams.yearMin, 2001);
  const yearMax = parseSearchParamNumber(searchParams.yearMax, 2016);
  const selectedStates = parseSearchParamArray(searchParams.states);
  const metric = (Array.isArray(searchParams.metric) ? searchParams.metric[0] : searchParams.metric) ?? "violent_crime_total";
  const mapYear = parseSearchParamNumber(searchParams.mapYear, 2016);

  const [crimeData, mapData] = await Promise.all([
    getCrimeData({
      yearMin,
      yearMax,
      states: selectedStates.length > 0 ? selectedStates : undefined,
    }),
    getCrimeMapData(mapYear),
  ]);

  const metricLabel = CRIME_METRICS.find((m) => m.value === metric)?.label ?? metric;

  // Build dual-axis chart data: aggregate by year for selected states
  const byYear = new Map<number, { incRate: number; crimeRate: number; count: number }>();
  for (const row of crimeData) {
    if (!row.statePopulation || !row.prisonerCount) continue;
    const metricVal = row[metric as keyof CrimeIncarceration] as number | null;
    if (metricVal == null) continue;

    const entry = byYear.get(row.year) ?? { incRate: 0, crimeRate: 0, count: 0 };
    entry.incRate += ratePer100k(row.prisonerCount, row.statePopulation);
    entry.crimeRate += ratePer100k(metricVal, row.statePopulation);
    entry.count += 1;
    byYear.set(row.year, entry);
  }

  const chartData = Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, d]) => ({
      year,
      incarcerationRate: Math.round((d.incRate / d.count) * 100) / 100,
      crimeRate: Math.round((d.crimeRate / d.count) * 100) / 100,
    }));

  // Map data
  const mapValues: Record<string, number> = {};
  for (const row of mapData) {
    const code = STATE_NAME_TO_CODE[row.jurisdiction];
    if (!code || !row.statePopulation) continue;
    const val = row[metric as keyof CrimeIncarceration] as number | null;
    if (val != null) {
      mapValues[code] = ratePer100k(val, row.statePopulation);
    }
  }

  // Table data
  const tableData = crimeData.map((row) => ({
    jurisdiction: titleCase(row.jurisdiction),
    year: row.year,
    prisonerCount: row.prisonerCount,
    statePopulation: row.statePopulation,
    violentCrimeTotal: row.violentCrimeTotal,
    murderManslaughter: row.murderManslaughter,
    robbery: row.robbery,
    aggAssault: row.aggAssault,
    propertyCrimeTotal: row.propertyCrimeTotal,
    burglary: row.burglary,
    larceny: row.larceny,
    vehicleTheft: row.vehicleTheft,
    incarcerationRate:
      row.prisonerCount && row.statePopulation
        ? ratePer100k(row.prisonerCount, row.statePopulation)
        : null,
  }));

  return (
    <CrimeCharts
      states={states}
      chartData={chartData}
      mapValues={mapValues}
      tableData={tableData}
      metricLabel={metricLabel}
      mapYear={mapYear}
    />
  );
}
