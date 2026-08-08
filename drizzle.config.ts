import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Direct connection (port 5432), NOT the transaction pooler. drizzle-kit
    // needs prepared statements / session connections for migrations.
    url: process.env.DIRECT_URL!,
  },
});
