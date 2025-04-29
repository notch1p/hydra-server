import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const DB_PATH =
  process.env.NODE_ENV === "production" ? "/data/sqlite.db" : "sqlite.db";

const sqlite = new Database(DB_PATH);
export const db = drizzle(sqlite);
db.run("PRAGMA journal_mode = WAL;");
