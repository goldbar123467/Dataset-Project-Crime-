import { db } from "../index";
import { unemploymentCounty } from "../schema";
import { and, eq, gte, lte, sql, inArray } from "drizzle-orm";

export async function getUnemploymentData(filters: {
  year?: number;
  states?: string[];
  rateMin?: number;
  rateMax?: number;
}) {
  const conditions: ReturnType<typeof eq>[] = [];

  if (filters.year) {
    conditions.push(eq(unemploymentCounty.year, filters.year));
  }
  if (filters.states && filters.states.length > 0) {
    conditions.push(inArray(unemploymentCounty.stateCode, filters.states));
  }
  if (filters.rateMin != null) {
    conditions.push(
      gte(
        sql`cast(${unemploymentCounty.unemploymentRate} as float)`,
        filters.rateMin
      )
    );
  }
  if (filters.rateMax != null) {
    conditions.push(
      lte(
        sql`cast(${unemploymentCounty.unemploymentRate} as float)`,
        filters.rateMax
      )
    );
  }

  return db
    .select()
    .from(unemploymentCounty)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(unemploymentCounty.stateCode, unemploymentCounty.county)
    .limit(5000);
}

export async function getUnemploymentByState(year: number) {
  return db
    .select({
      stateCode: unemploymentCounty.stateCode,
      avgRate: sql<number>`avg(cast(${unemploymentCounty.unemploymentRate} as float))`,
      totalLaborForce: sql<number>`sum(${unemploymentCounty.laborForce})`,
      totalUnemployed: sql<number>`sum(${unemploymentCounty.unemployed})`,
      countyCount: sql<number>`count(*)`,
    })
    .from(unemploymentCounty)
    .where(eq(unemploymentCounty.year, year))
    .groupBy(unemploymentCounty.stateCode)
    .orderBy(unemploymentCounty.stateCode);
}

export async function getUnemploymentDistribution(year: number) {
  return db
    .select({
      unemploymentRate: unemploymentCounty.unemploymentRate,
    })
    .from(unemploymentCounty)
    .where(eq(unemploymentCounty.year, year));
}

export async function getUnemploymentYears() {
  const result = await db
    .selectDistinct({ year: unemploymentCounty.year })
    .from(unemploymentCounty)
    .orderBy(unemploymentCounty.year);
  return result.map((r) => r.year);
}

export async function getUnemploymentStates() {
  const result = await db
    .selectDistinct({ stateCode: unemploymentCounty.stateCode })
    .from(unemploymentCounty)
    .orderBy(unemploymentCounty.stateCode);
  return result.map((r) => r.stateCode.trim());
}

export async function getUnemploymentSummary() {
  const result = await db
    .select({
      totalRows: sql<number>`count(*)`,
      minYear: sql<number>`min(${unemploymentCounty.year})`,
      maxYear: sql<number>`max(${unemploymentCounty.year})`,
      counties: sql<number>`count(distinct ${unemploymentCounty.county} || ${unemploymentCounty.stateCode})`,
    })
    .from(unemploymentCounty);
  return result[0];
}

export async function getNationalUnemploymentTrend() {
  return db
    .select({
      year: unemploymentCounty.year,
      avgRate: sql<number>`avg(cast(${unemploymentCounty.unemploymentRate} as float))`,
    })
    .from(unemploymentCounty)
    .groupBy(unemploymentCounty.year)
    .orderBy(unemploymentCounty.year);
}
