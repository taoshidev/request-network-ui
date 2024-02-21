"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { subnets } from "@/db/schema";

export const getSubnets = async () => {
  try {
    const results = await db.select().from(subnets);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};
