import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite";
import { table  } from './schema';

const sqlite = new Database("./db/mydb.sqlite");
if (!sqlite) {
    throw new Error("Failed to connect to the database. Please run the migration command to create the database.");
}
export const db = drizzle(sqlite, { schema: table });
export type db = typeof db