import { getMurderByRegionTrend, getMurderByDeathPenalty, getMurderData } from "@/db/queries/murder";
import { parseSearchParamNumber, parseSearchParamArray } from "@/lib/utils";
import { REGIONS, REGION_COLORS } from "@/lib/constants";
import { MurderCharts } from "./murder-charts";

interface MurderExplorerProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function MurderExplorer({ searchParams }: MurderExplorerProps) {
  const yearMin = parseSearchParamNumber(searchParams.yearMin, 1987);
  const yearMax = parseSearchParamNumber(searchParams.yearMax, 2020);
  const selectedRegions = parseSearchParamArray(searchParams.regions);

  const [regionTrend, dpData, rawData] = await Promise.all([
    getMurderByRegionTrend({ yearMin, yearMax }),
    getMurderByDeathPenalty({
      yearMin,
      yearMax,
      regions: selectedRegions.length > 0 ? selectedRegions : undefined,
    }),
    getMurderData({
      yearMin,
      yearMax,
      regions: selectedRegions.length > 0 ? selectedRegions : undefined,
    }),
  ]);

  // Region trend chart data — pivot by year
  const regionChartMap = new Map<number, Record<string, number>>();
  for (const row of regionTrend) {
    const entry = regionChartMap.get(row.year) ?? { year: row.year };
    if (row.region !== "United States") {
      entry[row.region] = parseFloat(row.murderRate ?? "0");
    } else {
      entry["US Average"] = parseFloat(row.murderRate ?? "0");
    }
    regionChartMap.set(row.year, entry);
  }
  const regionChartData = Array.from(regionChartMap.values()).sort(
    (a, b) => (a.year as number) - (b.year as number)
  );

  const regionYKeys = [
    ...REGIONS.map((r) => ({ key: r, label: r })),
    { key: "US Average", label: "US Average", dashed: true },
  ];

  const regionColors = [...REGIONS.map((r) => REGION_COLORS[r]), REGION_COLORS["United States"]];

  // Death penalty comparison data — small multiples per region
  const dpByRegionYear = new Map<string, Map<number, { dp: number; ndp: number; count_dp: number; count_ndp: number }>>();
  for (const row of dpData) {
    const regionMap = dpByRegionYear.get(row.region) ?? new Map();
    const entry = regionMap.get(row.year) ?? { dp: 0, ndp: 0, count_dp: 0, count_ndp: 0 };
    if (row.deathPenaltyStatus === "Death Penalty") {
      entry.dp += row.avgRate;
      entry.count_dp += 1;
    } else {
      entry.ndp += row.avgRate;
      entry.count_ndp += 1;
    }
    regionMap.set(row.year, entry);
    dpByRegionYear.set(row.region, regionMap);
  }

  const smallMultiples: Record<string, { year: number; deathPenalty: number; noDeathPenalty: number }[]> = {};
  for (const [region, yearMap] of dpByRegionYear) {
    smallMultiples[region] = Array.from(yearMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, d]) => ({
        year,
        deathPenalty: d.count_dp ? Math.round((d.dp / d.count_dp) * 100) / 100 : 0,
        noDeathPenalty: d.count_ndp ? Math.round((d.ndp / d.count_ndp) * 100) / 100 : 0,
      }));
  }

  // Divergence chart — national level dp vs ndp difference
  const divMap = new Map<number, { dp: number; ndp: number; count_dp: number; count_ndp: number }>();
  for (const row of dpData) {
    const entry = divMap.get(row.year) ?? { dp: 0, ndp: 0, count_dp: 0, count_ndp: 0 };
    if (row.deathPenaltyStatus === "Death Penalty") {
      entry.dp += row.avgRate;
      entry.count_dp += 1;
    } else {
      entry.ndp += row.avgRate;
      entry.count_ndp += 1;
    }
    divMap.set(row.year, entry);
  }

  const divergenceData = Array.from(divMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, d]) => ({
      year,
      difference:
        Math.round(
          ((d.count_dp ? d.dp / d.count_dp : 0) - (d.count_ndp ? d.ndp / d.count_ndp : 0)) * 100
        ) / 100,
    }));

  // Table data
  const tableData = rawData.map((r) => ({
    region: r.region,
    state: r.state,
    year: r.year,
    deathPenaltyStatus: r.deathPenaltyStatus,
    murderRate: parseFloat(r.murderRate ?? "0"),
  }));

  return (
    <MurderCharts
      regionChartData={regionChartData}
      regionYKeys={regionYKeys}
      regionColors={regionColors}
      smallMultiples={smallMultiples}
      divergenceData={divergenceData}
      tableData={tableData}
    />
  );
}
