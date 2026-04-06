import { db } from "../index";
import { crimeIncarceration } from "../schema";
import { eq, and, gte, lte, ne, sql, inArray } from "drizzle-orm";

export async function getCrimeData(filters: {
  yearMin?: number;
  yearMax?: number;
  states?: string[];
}) {
  const conditions = [ne(crimeIncarceration.jurisdiction, "FEDERAL")];

  if (filters.yearMin) {
    conditions.push(gte(crimeIncarceration.year, filters.yearMin));
  }
  if (filters.yearMax) {
    conditions.push(lte(crimeIncarceration.year, filters.yearMax));
  }
  if (filters.states && filters.states.length > 0) {
    conditions.push(inArray(crimeIncarceration.jurisdiction, filters.states));
  }

  return db
    .select()
    .from(crimeIncarceration)
    .where(and(...conditions))
    .orderBy(crimeIncarceration.year, crimeIncarceration.jurisdiction);
}

export async function getCrimeStates() {
  const result = await db
    .selectDistinct({ jurisdiction: crimeIncarceration.jurisdiction })
    .from(crimeIncarceration)
    .where(ne(crimeIncarceration.jurisdiction, "FEDERAL"))
    .orderBy(crimeIncarceration.jurisdiction);
  return result.map((r) => r.jurisdiction);
}

export async function getCrimeMapData(year: number) {
  return db
    .select()
    .from(crimeIncarceration)
    .where(
      and(
        eq(crimeIncarceration.year, year),
        ne(crimeIncarceration.jurisdiction, "FEDERAL")
      )
    );
}

export async function getCrimeSummary() {
  const result = await db
    .select({
      totalRows: sql<number>`count(*)`,
      minYear: sql<number>`min(${crimeIncarceration.year})`,
      maxYear: sql<number>`max(${crimeIncarceration.year})`,
      jurisdictions: sql<number>`count(distinct ${crimeIncarceration.jurisdiction})`,
    })
    .from(crimeIncarceration);
  return result[0];
}

export async function getNationalCrimeTrend() {
  return db
    .select({
      year: crimeIncarceration.year,
      totalViolentCrime: sql<number>`sum(${crimeIncarceration.violentCrimeTotal})`,
      totalPopulation: sql<number>`sum(${crimeIncarceration.statePopulation})`,
    })
    .from(crimeIncarceration)
    .where(ne(crimeIncarceration.jurisdiction, "FEDERAL"))
    .groupBy(crimeIncarceration.year)
    .orderBy(crimeIncarceration.year);
}
