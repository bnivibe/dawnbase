import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema/articles";

/**
 * Database client singleton for Supabase PostgreSQL connection.
 *
 * Requires DATABASE_URL environment variable to be set.
 * Uses `postgres` (postgres.js) as the driver.
 *
 * Install the driver if not already installed:
 *   npm install postgres
 */

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL!;

const conn = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });
