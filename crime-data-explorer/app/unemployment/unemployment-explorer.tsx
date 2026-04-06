import {
  getUnemploymentData,
  getUnemploymentByState,
  getUnemploymentDistribution,
  getUnemploymentYears,
  getUnemploymentStates,
} from "@/db/queries/unemployment";
import { parseSearchParamNumber, parseSearchParamArray } from "@/lib/utils";
import { STATE_CODE_TO_PROPER_NAME } from "@/lib/constants";
import { UnemploymentCharts } from "./unemployment-charts";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function UnemploymentExplorer({ searchParams }: Props) {
  const [years, states] = await Promise.all([
    getUnemploymentYears(),
    getUnemploymentStates(),
  ]);

  const selectedYear = parseSearchParamNumber(searchParams.year, years[years.length - 1] ?? 2018);
  const selectedStates = parseSearchParamArray(searchParams.states);

  const [stateData, distribution, countyData] = await Promise.all([
    getUnemploymentByState(selectedYear),
    getUnemploymentDistribution(selectedYear),
    getUnemploymentData({
      year: selectedYear,
      states: selectedStates.length > 0 ? selectedStates : undefined,
    }),
  ]);

  // Map data for choropleth
  const mapValues: Record<string, number> = {};
  for (const row of stateData) {
    mapValues[row.stateCode.trim()] = Math.round(row.avgRate * 100) / 100;
  }

  // Distribution data
  const distValues = distribution
    .map((r) => parseFloat(r.unemploymentRate ?? "0"))
    .filter((v) => !isNaN(v));

  // Table data
  const tableData = countyData.map((r) => ({
    county: r.county,
    state: STATE_CODE_TO_PROPER_NAME[r.stateCode.trim()] ?? r.stateCode,
    stateCode: r.stateCode.trim(),
    laborForce: r.laborForce,
    employed: r.employed,
    unemployed: r.unemployed,
    unemploymentRate: parseFloat(r.unemploymentRate ?? "0"),
    year: r.year,
  }));

  return (
    <UnemploymentCharts
      years={years}
      states={states}
      mapValues={mapValues}
      distValues={distValues}
      tableData={tableData}
      selectedYear={selectedYear}
    />
  );
}
