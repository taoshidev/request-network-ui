"use server";

import { db } from "@/db";

export const getSubnets = async (query) => {
  try {
    const results = await db.query.subnets.findMany(query);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};
