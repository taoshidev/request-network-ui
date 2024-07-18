import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";

import { subnets } from "./schema";
import { seedData } from "./data/subnets";
import { SubnetType } from "./types/subnet";
import { captureException } from "@sentry/nextjs";

loadEnvConfig(cwd());

const connectionString = process.env.DATABASE_URL as string;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

const seed = async () => {
  try {
    console.info("Seeding...");

    const dbSubnets = await db.select().from(subnets);
    const subnetNetUids = dbSubnets.map((sn) => sn.netUid);
    const { newSubnets, existingSubnets } = seedData.reduce(
      (prev, subnet) => {
        if (subnetNetUids.some((netUid) => netUid === subnet.netUid)) {
          prev.existingSubnets.push(subnet);
        } else {
          prev.newSubnets.push(subnet);
        }
        return prev;
      },
      {
        newSubnets: [],
        existingSubnets: [],
      } as {
        newSubnets: Partial<SubnetType>[];
        existingSubnets: Partial<SubnetType>[];
      }
    );

    if (newSubnets.length) {
      await db
        .insert(subnets)
        .values(newSubnets as any[])
        .onConflictDoNothing({ target: subnets.id });
    }

    for (let existingSubnet of existingSubnets) {
      const dbSubnet = dbSubnets.find(subnet => subnet.netUid === existingSubnet.netUid);

      if (dbSubnet && dbSubnet.label !== existingSubnet?.label) {
        await db
          .update(subnets)
          .set({ label: existingSubnet.label })
          .where(eq(subnets.id, dbSubnet.id));
      }
    }

    console.info("Seeded");
  } catch (error) {
    console.error("Seeding failed");
    captureException(error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seed().catch((error) => {
  console.error("Unhandled error");
  captureException(error);
  process.exit(1);
});
