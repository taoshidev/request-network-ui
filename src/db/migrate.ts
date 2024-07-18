import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";
import { captureException } from "@sentry/nextjs";

const connectionString = process.env.DATABASE_URL as string;

export const runMigration = async (): Promise<void> => {
  try {
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema });

    console.info("Running migrations...");
    await migrate(db, { migrationsFolder: "src/db/migrations" });

    await client.end();
    console.info("Migrations completed successfully.");
  } catch (error) {
    console.error("Failed to execute migrations");
    captureException(error);
  }
};

runMigration().catch((error) => captureException(error));
