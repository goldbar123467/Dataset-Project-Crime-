import { getCorrelationData, getNationalTrends } from "@/db/queries/correlations";
import { parseSearchParamNumber } from "@/lib/utils";
import { CorrelationsCharts } from "./correlations-charts";

// Map states to regions for coloring
const STATE_TO_REGION: Record<string, string> = {
  CT: "Northeast", ME: "Northeast", MA: "Northeast", NH: "Northeast",
  RI: "Northeast", VT: "Northeast", NJ: "Northeast", NY: "Northeast", PA: "Northeast",
  IL: "Midwest", IN: "Midwest", MI: "Midwest", OH: "Midwest", WI: "Midwest",
  IA: "Midwest", KS: "Midwest", MN: "Midwest", MO: "Midwest", NE: "Midwest",
  ND: "Midwest", SD: "Midwest",
  DE: "South", FL: "South", GA: "South", MD: "South", NC: "South",
  SC: "South", VA: "South", DC: "South", WV: "South", AL: "South",
  KY: "South", MS: "South", TN: "South", AR: "South", LA: "South",
  OK: "South", TX: "South",
  AZ: "West", CO: "West", ID: "West", MT: "West", NV: "West",
  NM: "West", UT: "West", WY: "West", AK: "West", CA: "West",
  HI: "West", OR: "West", WA: "West",
};

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function CorrelationsExplorer({ searchParams }: Props) {
  const yearMin = parseSearchParamNumber(searchParams.yearMin, 2007);
  const yearMax = parseSearchParamNumber(searchParams.yearMax, 2016);

  const [correlationData, nationalTrends] = await Promise.all([
    getCorrelationData({ yearMin, yearMax }),
    getNationalTrends(),
  ]);

  // Aggregate per state across years for scatter
  const stateAgg = new Map<string, {
    state: string;
    stateCode: string;
    totalUnemployment: number;
    totalCrimeRate: number;
    totalPop: number;
    count: number;
  }>();

  for (const row of correlationData) {
    if (!row || !row.violentCrimeRate || !row.population) continue;
    const entry = stateAgg.get(row.stateCode) ?? {
      state: row.state,
      stateCode: row.stateCode,
      totalUnemployment: 0,
      totalCrimeRate: 0,
      totalPop: 0,
      count: 0,
    };
    entry.totalUnemployment += row.unemploymentRate;
    entry.totalCrimeRate += row.violentCrimeRate;
    entry.totalPop += row.population;
    entry.count += 1;
    stateAgg.set(row.stateCode, entry);
  }

  const scatterData = Array.from(stateAgg.values()).map((s) => ({
    x: Math.round((s.totalUnemployment / s.count) * 100) / 100,
    y: Math.round((s.totalCrimeRate / s.count) * 100) / 100,
    z: Math.round(s.totalPop / s.count / 100000),
    name: `${s.state} (${s.stateCode})`,
    region: STATE_TO_REGION[s.stateCode] ?? "Other",
  }));

  const trendData = nationalTrends.map((t) => ({
    year: t.year,
    incarcerationRate: Math.round(t.incarcerationRate * 100) / 100,
    unemploymentRate: Math.round(t.unemploymentRate * 100) / 100,
  }));

  return (
    <CorrelationsCharts
      scatterData={scatterData}
      trendData={trendData}
    />
  );
}
