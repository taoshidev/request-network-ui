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

export const getSubnet = async ({ id }: { id: string }) => {
  const res = await db.query.subnets.findFirst({
    where: (subnets, { eq }) => eq(subnets.id, id as string),
  });
  if (!res) throw new Error(`Subnet with ID ${id} not found.`);
  return res as SubnetType;
};