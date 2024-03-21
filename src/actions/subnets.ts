"use server";

import { db } from "@/db";

export const getSubnets = async (query?: object) => {
  try {
    const results = await db.query.subnets.findMany(query && query);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};
