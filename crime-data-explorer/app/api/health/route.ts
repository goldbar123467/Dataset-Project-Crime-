import { NextResponse } from "next/server";
import { db } from "@/db";
import { crimeIncarceration, murderRates, unemploymentCounty } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const [crimeCount, murderCount, unemploymentCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(crimeIncarceration),
      db.select({ count: sql<number>`count(*)` }).from(murderRates),
      db.select({ count: sql<number>`count(*)` }).from(unemploymentCounty),
    ]);

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      tables: {
        crime_incarceration: crimeCount[0].count,
        murder_rates: murderCount[0].count,
        unemployment_county: unemploymentCount[0].count,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
