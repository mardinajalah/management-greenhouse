import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "@/lib/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  greenhousePool?: mysql.Pool;
};

const pool =
  globalForDb.greenhousePool ??
  mysql.createPool({
    uri: env.DATABASE_URL,
    connectionLimit: 10,
    waitForConnections: true,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.greenhousePool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
