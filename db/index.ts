import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDb> | undefined;
};

function createDb() {
  const client = postgres(env.DATABASE_URL, {
    // Supabase's transaction-mode pooler does not support prepared statements;
    // without this, queries fail with cryptic "prepared statement does not exist"
    // style errors.
    prepare: false,
    max: 1,
    idle_timeout: 20,
    // The pooler occasionally drops a connection instead of replying; fail the
    // query quickly rather than letting the request hang forever.
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

export * from "./schema";
