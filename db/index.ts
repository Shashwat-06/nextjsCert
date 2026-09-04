import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Force the app to load environment variables from the test file if it exists
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env.test" });

// Add a fallback so the server doesn't crash during build time
const connectionString = process.env.DATABASE_URL || "";

export const db = drizzle(connectionString, { schema });
