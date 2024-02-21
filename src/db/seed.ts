import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { v4 as uuidv4 } from "uuid";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { times } from "lodash";

import { subnets } from "./schema";

loadEnvConfig(cwd());

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

const insertData = times(32).map((index) => ({
  value: uuidv4(),
  label: `Subnet ${index}`,
}));

const seed = async () => {
  try {
    console.log("Seeding...");

    await db
      .insert(subnets)
      .values(insertData)
      .onConflictDoNothing({ target: subnets.value });

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
