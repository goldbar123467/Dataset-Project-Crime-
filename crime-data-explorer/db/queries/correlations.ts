import { db } from "../index";
import { crimeIncarceration, unemploymentCounty } from "../schema";
import { and, gte, lte, ne, sql, eq } from "drizzle-orm";
import { STATE_NAME_TO_CODE } from "../../lib/constants";

export async function getCorrelationData(filters: {
  yearMin?: number;
  yearMax?: number;
}) {
  const yearMin = filters.yearMin ?? 2007;
  const yearMax = filters.yearMax ?? 2016;

  // Get crime data for the overlap period
  const crimeData = await db
    .select()
    .from(crimeIncarceration)
    .where(
      and(
        ne(crimeIncarceration.jurisdiction, "FEDERAL"),
        gte(crimeIncarceration.year, yearMin),
        lte(crimeIncarceration.year, yearMax)
      )
    );

  // Get unemployment aggregated by state for the overlap period
  const unemploymentData = await db
    .select({
      stateCode: unemploymentCounty.stateCode,
      year: unemploymentCounty.year,
      avgRate: sql<number>`avg(cast(${unemploymentCounty.unemploymentRate} as float))`,
      totalLaborForce: sql<number>`sum(${unemploymentCounty.laborForce})`,
    })
    .from(unemploymentCounty)
    .where(
      and(
        gte(unemploymentCounty.year, yearMin),
        lte(unemploymentCounty.year, yearMax)
      )
    )
    .groupBy(unemploymentCounty.stateCode, unemploymentCounty.year);

  // Join in memory using state name mapping
  const unemploymentMap = new Map<string, { avgRate: number; totalLaborForce: number }>();
  for (const u of unemploymentData) {
    unemploymentMap.set(`${u.stateCode.trim()}-${u.year}`, {
      avgRate: u.avgRate,
      totalLaborForce: u.totalLaborForce,
    });
  }

  const joined = crimeData
    .map((c) => {
      const code = STATE_NAME_TO_CODE[c.jurisdiction];
      if (!code) return null;
      const uKey = `${code}-${c.year}`;
      const uData = unemploymentMap.get(uKey);
      if (!uData) return null;

      return {
        state: c.jurisdiction,
        stateCode: code,
        year: c.year,
        population: c.statePopulation,
        prisonerCount: c.prisonerCount,
        violentCrimeTotal: c.violentCrimeTotal,
        propertyCrimeTotal: c.propertyCrimeTotal,
        unemploymentRate: uData.avgRate,
        laborForce: uData.totalLaborForce,
        violentCrimeRate:
          c.violentCrimeTotal && c.statePopulation
            ? (c.violentCrimeTotal / c.statePopulation) * 100000
            : null,
        incarcerationRate:
          c.prisonerCount && c.statePopulation
            ? (c.prisonerCount / c.statePopulation) * 100000
            : null,
      };
    })
    .filter(Boolean);

  return joined;
}

export async function getNationalTrends() {
  const crimeAgg = await db
    .select({
      year: crimeIncarceration.year,
      totalPrisoners: sql<number>`sum(${crimeIncarceration.prisonerCount})`,
      totalPop: sql<number>`sum(${crimeIncarceration.statePopulation})`,
    })
    .from(crimeIncarceration)
    .where(
      and(
        ne(crimeIncarceration.jurisdiction, "FEDERAL"),
        gte(crimeIncarceration.year, 2007),
        lte(crimeIncarceration.year, 2016)
      )
    )
    .groupBy(crimeIncarceration.year)
    .orderBy(crimeIncarceration.year);

  const unemploymentAgg = await db
    .select({
      year: unemploymentCounty.year,
      avgRate: sql<number>`avg(cast(${unemploymentCounty.unemploymentRate} as float))`,
    })
    .from(unemploymentCounty)
    .where(
      and(
        gte(unemploymentCounty.year, 2007),
        lte(unemploymentCounty.year, 2016)
      )
    )
    .groupBy(unemploymentCounty.year)
    .orderBy(unemploymentCounty.year);

  const unemploymentMap = new Map(unemploymentAgg.map((u) => [u.year, u.avgRate]));

  return crimeAgg.map((c) => ({
    year: c.year,
    incarcerationRate: c.totalPop
      ? (c.totalPrisoners / c.totalPop) * 100000
      : 0,
    unemploymentRate: unemploymentMap.get(c.year) ?? 0,
  }));
}
