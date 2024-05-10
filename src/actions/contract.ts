"use server";

import { revalidatePath } from "next/cache";
import { eq, asc, exists } from "drizzle-orm";
import { db } from "@/db";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { contracts } from "@/db/schema";
import { ContractType } from "@/db/types/contract";

export const getContracts = async (query: object = {}) => {
  try {
    const res = await db.query.contracts.findMany(
      Object.assign(query, {
        orderBy: (contracts, { asc }) => [asc(contracts?.title)],
      })
    );
    return filterData(res, [""]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getContract = async ({ id }: { id: string }) => {
  const res = await db.query.contracts.findFirst({
    where: (contracts, { eq }) => eq(contracts.id, id as string),
  });
  if (!res) throw new Error(`Validator with ID ${id} not found.`);
  return filterData(res, [""]);
};

export const updateContract = async ({
  id,
  ...values
}: Partial<ContractType>) => {
  try {
    const res = await db
      .update(contracts)
      .set({ ...values } as any)
      .where(eq(contracts.id, id as string))
      .returning();

    revalidatePath(`/contracts/${id}`);
    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createContract = async (contract: ContractType) => {
  try {
    const res = await db
      .insert(contracts)
      .values(contract as any)
      .returning();

    revalidatePath("/dashboard");
    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
