import { db } from "../index";
import { murderRates } from "../schema";
import { and, gte, lte, ne, sql, inArray, eq } from "drizzle-orm";

export async function getMurderData(filters: {
  yearMin?: number;
  yearMax?: number;
  regions?: string[];
  deathPenaltyStatuses?: string[];
}) {
  if (!db) return [];
  try {
    const conditions = [ne(murderRates.deathPenaltyStatus, "Region")];
    if (filters.yearMin) conditions.push(gte(murderRates.year, filters.yearMin));
    if (filters.yearMax) conditions.push(lte(murderRates.year, filters.yearMax));
    if (filters.regions && filters.regions.length > 0) {
      conditions.push(inArray(murderRates.region, filters.regions));
    }
    if (filters.deathPenaltyStatuses && filters.deathPenaltyStatuses.length > 0) {
      conditions.push(inArray(murderRates.deathPenaltyStatus, filters.deathPenaltyStatuses));
    }
    return db
      .select()
      .from(murderRates)
      .where(and(...conditions))
      .orderBy(murderRates.year, murderRates.region);
  } catch {
    return [];
  }
}

export async function getMurderByRegionTrend(filters: {
  yearMin?: number;
  yearMax?: number;
}) {
  if (!db) return [];
  try {
    const conditions = [eq(murderRates.deathPenaltyStatus, "Region")];
    if (filters.yearMin) conditions.push(gte(murderRates.year, filters.yearMin));
    if (filters.yearMax) conditions.push(lte(murderRates.year, filters.yearMax));
    return db
      .select()
      .from(murderRates)
      .where(and(...conditions))
      .orderBy(murderRates.year);
  } catch {
    return [];
  }
}

export async function getMurderByDeathPenalty(filters: {
  yearMin?: number;
  yearMax?: number;
  regions?: string[];
}) {
  if (!db) return [];
  try {
    const conditions = [
      ne(murderRates.deathPenaltyStatus, "Region"),
      ne(murderRates.region, "United States"),
    ];
    if (filters.yearMin) conditions.push(gte(murderRates.year, filters.yearMin));
    if (filters.yearMax) conditions.push(lte(murderRates.year, filters.yearMax));
    if (filters.regions && filters.regions.length > 0) {
      conditions.push(inArray(murderRates.region, filters.regions));
    }
    return db
      .select({
        year: murderRates.year,
        region: murderRates.region,
        deathPenaltyStatus: murderRates.deathPenaltyStatus,
        avgRate: sql<number>`avg(cast(${murderRates.murderRate} as float))`,
      })
      .from(murderRates)
      .where(and(...conditions))
      .groupBy(murderRates.year, murderRates.region, murderRates.deathPenaltyStatus)
      .orderBy(murderRates.year);
  } catch {
    return [];
  }
}

export async function getMurderSummary() {
  if (!db) return { totalRows: 0, minYear: 0, maxYear: 0 };
  try {
    const result = await db
      .select({
        totalRows: sql<number>`count(*)`,
        minYear: sql<number>`min(${murderRates.year})`,
        maxYear: sql<number>`max(${murderRates.year})`,
      })
      .from(murderRates);
    return result[0] ?? { totalRows: 0, minYear: 0, maxYear: 0 };
  } catch {
    return { totalRows: 0, minYear: 0, maxYear: 0 };
  }
}

export async function getNationalMurderTrend() {
  if (!db) return [];
  try {
    return db
      .select({
        year: murderRates.year,
        murderRate: murderRates.murderRate,
      })
      .from(murderRates)
      .where(
        and(
          eq(murderRates.region, "United States"),
          eq(murderRates.deathPenaltyStatus, "Region")
        )
      )
      .orderBy(murderRates.year);
  } catch {
    return [];
  }
}
