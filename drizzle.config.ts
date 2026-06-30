import { defineConfig } from "drizzle-kit";

// Migrations run against the DIRECT (non-pooled) connection — same host without
// "-pooler". The running app uses the pooled DATABASE_URL. See .env.example.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});
