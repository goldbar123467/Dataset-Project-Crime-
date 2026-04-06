import { db } from "../index";
import { crimeIncarceration } from "../schema";
import { and, gte, lte, ne, sql, inArray } from "drizzle-orm";

export async function getCrimeData(filters: {
  yearMin?: number;
  yearMax?: number;
  states?: string[];
}) {
  if (!db) return [];
  try {
    const conditions = [ne(crimeIncarceration.jurisdiction, "FEDERAL")];
    if (filters.yearMin) conditions.push(gte(crimeIncarceration.year, filters.yearMin));
    if (filters.yearMax) conditions.push(lte(crimeIncarceration.year, filters.yearMax));
    if (filters.states && filters.states.length > 0) {
      conditions.push(inArray(crimeIncarceration.jurisdiction, filters.states));
    }
    return db
      .select()
      .from(crimeIncarceration)
      .where(and(...conditions))
      .orderBy(crimeIncarceration.year, crimeIncarceration.jurisdiction);
  } catch {
    return [];
  }
}

export async function getCrimeStates() {
  if (!db) return [];
  try {
    const result = await db
      .selectDistinct({ jurisdiction: crimeIncarceration.jurisdiction })
      .from(crimeIncarceration)
      .where(ne(crimeIncarceration.jurisdiction, "FEDERAL"))
      .orderBy(crimeIncarceration.jurisdiction);
    return result.map((r) => r.jurisdiction);
  } catch {
    return [];
  }
}

export async function getCrimeMapData(year: number) {
  if (!db) return [];
  try {
    return db
      .select()
      .from(crimeIncarceration)
      .where(
        and(
          sql`${crimeIncarceration.year} = ${year}`,
          ne(crimeIncarceration.jurisdiction, "FEDERAL")
        )
      );
  } catch {
    return [];
  }
}

export async function getCrimeSummary() {
  if (!db) return { totalRows: 0, minYear: 0, maxYear: 0, jurisdictions: 0 };
  try {
    const result = await db
      .select({
        totalRows: sql<number>`count(*)`,
        minYear: sql<number>`min(${crimeIncarceration.year})`,
        maxYear: sql<number>`max(${crimeIncarceration.year})`,
        jurisdictions: sql<number>`count(distinct ${crimeIncarceration.jurisdiction})`,
      })
      .from(crimeIncarceration);
    return result[0] ?? { totalRows: 0, minYear: 0, maxYear: 0, jurisdictions: 0 };
  } catch {
    return { totalRows: 0, minYear: 0, maxYear: 0, jurisdictions: 0 };
  }
}

export async function getNationalCrimeTrend() {
  if (!db) return [];
  try {
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
  } catch {
    return [];
  }
}
