import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    return drizzle(sql, { schema });
  } catch {
    return null;
  }
}

export const db = getDb();
