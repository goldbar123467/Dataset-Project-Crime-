import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { parse } from "csv-parse/sync";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

function stripBom(str: string): string {
  return str.replace(/^\uFEFF/, "");
}

function stripCommas(val: string): string {
  return val.replace(/,/g, "");
}

function toIntOrNull(val: string | undefined): number | null {
  if (!val || val.trim() === "") return null;
  const cleaned = stripCommas(val.trim().replace(/\r/g, ""));
  const n = parseFloat(cleaned);
  if (isNaN(n)) return null;
  return Math.round(n);
}

function toFloatOrNull(val: string | undefined): string | null {
  if (!val || val.trim() === "") return null;
  const cleaned = stripCommas(val.trim().replace(/\r/g, ""));
  const n = parseFloat(cleaned);
  if (isNaN(n)) return null;
  return n.toString();
}

function toBoolOrNull(val: string | undefined): boolean | null {
  if (!val || val.trim() === "") return null;
  const v = val.trim().toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

export const maxDuration = 300;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const seedSecret = process.env.SEED_SECRET;
  if (seedSecret && authHeader !== `Bearer ${seedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const crimeFile = formData.get("crime") as File | null;
    const murderFile = formData.get("murder") as File | null;
    const unemploymentFile = formData.get("unemployment") as File | null;

    const results: Record<string, string> = {};

    // Create tables
    await sql`CREATE TABLE IF NOT EXISTS crime_incarceration (
      jurisdiction VARCHAR(100) NOT NULL,
      includes_jails BOOLEAN,
      year INTEGER NOT NULL,
      prisoner_count INTEGER,
      crime_reporting_change BOOLEAN,
      crimes_estimated BOOLEAN,
      state_population BIGINT,
      violent_crime_total INTEGER,
      murder_manslaughter INTEGER,
      rape_legacy INTEGER,
      rape_revised INTEGER,
      robbery INTEGER,
      agg_assault INTEGER,
      property_crime_total INTEGER,
      burglary INTEGER,
      larceny INTEGER,
      vehicle_theft INTEGER
    )`;
    await sql`CREATE TABLE IF NOT EXISTS murder_rates (
      region VARCHAR(50) NOT NULL,
      state VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      death_penalty_status VARCHAR(50) NOT NULL,
      murder_rate DECIMAL(10, 2),
      number_of_records INTEGER
    )`;
    await sql`CREATE TABLE IF NOT EXISTS unemployment_county (
      county VARCHAR(100) NOT NULL,
      state_code CHAR(2) NOT NULL,
      labor_force INTEGER,
      employed INTEGER,
      unemployed INTEGER,
      unemployment_rate DECIMAL(5, 2),
      year INTEGER NOT NULL
    )`;

    if (crimeFile) {
      const raw = stripBom(await crimeFile.text());
      const records = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
      await sql`TRUNCATE TABLE crime_incarceration`;
      const rows = records.map((r) => ({
        jurisdiction: r.jurisdiction.trim(),
        includesJails: toBoolOrNull(r.includes_jails),
        year: parseInt(r.year),
        prisonerCount: toIntOrNull(r.prisoner_count),
        crimeReportingChange: toBoolOrNull(r.crime_reporting_change),
        crimesEstimated: toBoolOrNull(r.crimes_estimated),
        statePopulation: toIntOrNull(r.state_population),
        violentCrimeTotal: toIntOrNull(r.violent_crime_total),
        murderManslaughter: toIntOrNull(r.murder_manslaughter),
        rapeLegacy: toIntOrNull(r.rape_legacy),
        rapeRevised: toIntOrNull(r.rape_revised),
        robbery: toIntOrNull(r.robbery),
        aggAssault: toIntOrNull(r.agg_assault),
        propertyCrimeTotal: toIntOrNull(r.property_crime_total),
        burglary: toIntOrNull(r.burglary),
        larceny: toIntOrNull(r.larceny),
        vehicleTheft: toIntOrNull(r.vehicle_theft),
      }));
      for (let i = 0; i < rows.length; i += 100) {
        await db.insert(schema.crimeIncarceration).values(rows.slice(i, i + 100));
      }
      results.crime = `Inserted ${rows.length} rows`;
    }

    if (murderFile) {
      const raw = stripBom(await murderFile.text());
      const records = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
      await sql`TRUNCATE TABLE murder_rates`;
      const rows = records.map((r) => ({
        region: r["Region"].trim(),
        state: r["State"].trim(),
        year: parseInt(r["Year of Year"].trim().replace(/\r/g, "")),
        deathPenaltyStatus: r["Death Penalty Status"].trim(),
        murderRate: toFloatOrNull(r["Murder Rate"]),
        numberOfRecords: toIntOrNull(r["Number of Records"]),
      }));
      for (let i = 0; i < rows.length; i += 100) {
        await db.insert(schema.murderRates).values(rows.slice(i, i + 100));
      }
      results.murder = `Inserted ${rows.length} rows`;
    }

    if (unemploymentFile) {
      const raw = stripBom(await unemploymentFile.text());
      const records = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[];
      await sql`TRUNCATE TABLE unemployment_county`;
      const rows = records.map((r) => ({
        county: r["County"].trim().replace(/\r/g, ""),
        stateCode: r["State"].trim().replace(/\r/g, ""),
        laborForce: toIntOrNull(r["Labor Force"]),
        employed: toIntOrNull(r["Employed"]),
        unemployed: toIntOrNull(r["Unemployed"]),
        unemploymentRate: toFloatOrNull(r["Unemployment Rate"]),
        year: toIntOrNull(r["Year"])!,
      }));
      for (let i = 0; i < rows.length; i += 100) {
        await db.insert(schema.unemploymentCounty).values(rows.slice(i, i + 100));
      }
      results.unemployment = `Inserted ${rows.length} rows`;
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
