import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load local env file for your machine
dotenv.config({ path: ".env.local" });
// Load test env file for GitHub Actions
dotenv.config({ path: ".env.test" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
