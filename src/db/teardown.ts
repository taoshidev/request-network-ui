import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, subnets, validators, endpoints } from "./schema";
import { captureException } from "@sentry/nextjs";

loadEnvConfig(cwd());

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

const teardown = async () => {
  try {
    console.info("Teardown Started...");

    await db.delete(users);
    await db.delete(subnets);
    await db.delete(validators);
    await db.delete(endpoints);

    console.info("Teardown Completed");
  } catch (error) {
    console.error("Teardown failed");
    captureException(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

teardown().catch((error) => {
  console.error("Unhandled error");
  captureException(error);
  process.exit(1);
});
