import { defineConfig } from "drizzle-kit";

/** Real URL required for `pnpm db:migrate`; placeholder is enough for `pnpm drizzle-kit generate`. */
const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://127.0.0.1:5432/peoples_portfolio_placeholder";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
});
