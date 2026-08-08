import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is missing"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is missing"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");
  throw new Error(
    `Invalid environment configuration. Missing or invalid variable(s): ${missing}. ` +
      "Check .env.local / .env — see .env.example. DATABASE_URL must be the Supabase " +
      "transaction pooler (port 6543) and DIRECT_URL the direct connection (port 5432).",
  );
}

export const env = parsed.data;
