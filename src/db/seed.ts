import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { subnets } from "./schema";
import { seedData } from "./data/subnets";

loadEnvConfig(cwd());

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

const seed = async () => {
  try {
    console.log("Seeding...");

    await db.delete(subnets);
    await db
      .insert(subnets)
      .values(seedData)
      .onConflictDoNothing({ target: subnets.id });

    console.log("Seeded");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seed().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
