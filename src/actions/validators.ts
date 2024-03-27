"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

import { validators } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
interface AccountMetaType {
  genesisHash: string;
  name: string;
  source: string;
}

export interface AccountType {
  address: string;
  meta: AccountMetaType;
  type: string;
}

export interface ValidatorType {
  signature: string | null;
  name: string;
  description: string;
  hotkey: string;
  account: AccountType;
  id: string;
  verified: boolean;
  userId: string;
  vtrust: string | null;
}

export const getValidators = async (query: object = {}) => {
  try {
    const res = await db.query.validators.findMany(query);
    return filterData(res, ["hotkey"]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getValidator = async ({ id }: ValidatorType) => {
  const res = await db.query.validators.findFirst({
    where: (validators, { eq }) => eq(validators.id, id),
  });
  if (!res) throw new Error(`Validator with ID ${id} not found.`);
  return filterData(res, ["hotkey"]);
};

export const updateValidator = async ({ id, ...values }: Partial<ValidatorType>) => {
  try {
    const res = await db
      .update(validators)
      .set({ ...values })
      .where(eq(validators.id, id as string))
      .returning();

    revalidatePath(`/validators/${id}`);

    return parseResult(res, { filter: ["hotkey"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createValidator = async (validator: ValidatorType) => {
  try {
    const res = await db.insert(validators).values(validator);

    revalidatePath("/dashboard");
    return parseResult(res, { filter: ["hotkey"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
