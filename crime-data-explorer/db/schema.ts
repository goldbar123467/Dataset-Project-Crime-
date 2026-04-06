import {
  pgTable,
  varchar,
  integer,
  boolean,
  decimal,
  bigint,
  char,
} from "drizzle-orm/pg-core";

export const crimeIncarceration = pgTable("crime_incarceration", {
  jurisdiction: varchar("jurisdiction", { length: 100 }).notNull(),
  includesJails: boolean("includes_jails"),
  year: integer("year").notNull(),
  prisonerCount: integer("prisoner_count"),
  crimeReportingChange: boolean("crime_reporting_change"),
  crimesEstimated: boolean("crimes_estimated"),
  statePopulation: bigint("state_population", { mode: "number" }),
  violentCrimeTotal: integer("violent_crime_total"),
  murderManslaughter: integer("murder_manslaughter"),
  rapeLegacy: integer("rape_legacy"),
  rapeRevised: integer("rape_revised"),
  robbery: integer("robbery"),
  aggAssault: integer("agg_assault"),
  propertyCrimeTotal: integer("property_crime_total"),
  burglary: integer("burglary"),
  larceny: integer("larceny"),
  vehicleTheft: integer("vehicle_theft"),
});

export const murderRates = pgTable("murder_rates", {
  region: varchar("region", { length: 50 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  deathPenaltyStatus: varchar("death_penalty_status", { length: 50 }).notNull(),
  murderRate: decimal("murder_rate", { precision: 10, scale: 2 }),
  numberOfRecords: integer("number_of_records"),
});

export const unemploymentCounty = pgTable("unemployment_county", {
  county: varchar("county", { length: 100 }).notNull(),
  stateCode: char("state_code", { length: 2 }).notNull(),
  laborForce: integer("labor_force"),
  employed: integer("employed"),
  unemployed: integer("unemployed"),
  unemploymentRate: decimal("unemployment_rate", { precision: 5, scale: 2 }),
  year: integer("year").notNull(),
});

export type CrimeIncarceration = typeof crimeIncarceration.$inferSelect;
export type MurderRate = typeof murderRates.$inferSelect;
export type UnemploymentCounty = typeof unemploymentCounty.$inferSelect;
