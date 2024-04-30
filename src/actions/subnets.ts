"use server";

import { db } from "@/db";
import { SubnetType } from "@/db/types/subnet";

export const getSubnets = async (query?: object): Promise<SubnetType[] | void> => {
  try {
    const results = await db.query.subnets.findMany(query && query);

    return results as SubnetType[];
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};
