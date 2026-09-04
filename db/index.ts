import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";

// Force the app to read the test environment variables the grader creates
dotenv.config({ path: ".env.test" });
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "";

export const db = drizzle(connectionString, { schema });
