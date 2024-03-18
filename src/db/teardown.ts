import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import { users, subnets, validators, endpoints } from "./schema";

loadEnvConfig(cwd());

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

const teardown = async () => {
  try {
    console.log("Teardown Started...");

    await db.delete(users);
    await db.delete(subnets);
    await db.delete(validators);
    await db.delete(endpoints);

    console.log("Teardown Completed");
  } catch (error) {
    console.error("Teardown failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

teardown().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
