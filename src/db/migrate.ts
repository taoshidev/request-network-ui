import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL as string;

export const runMigration = async (): Promise<void> => {
  try {
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle(client, { schema });

    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "src/db/migrations" });

    await client.end();
    console.log("Migrations completed successfully.");
  } catch (error) {
    console.log(`Failed to execute migrations: ${error}`);
    process.exit(1);
  }
};

runMigration().catch((error) => console.log(error));
