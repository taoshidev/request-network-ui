"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

import { subnets, validators } from "@/db/schema";

export const getValidators = async () => {
  try {
    const results = await db.query.validators.findMany({
      with: {
        subnets: true,
      },
    });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getValidator = async ({ id }: { id: string }) => {
  try {
    const results = await db.query.validators.findFirst({
      where: (validators, { eq }) => eq(validators.id, id),
    });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const updateValidator = async ({ id, ...values }) => {
  try {
    const results = await db
      .update(validators)
      .set({ ...values })
      .where(eq(validators.id, id));

    revalidatePath(`/validators/${id}`);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

interface Validator {
  id: string;
  hotkey: string;
  subnetId: string;
  userId: string;
}

export const createValidator = async (validator: Validator) => {
  try {
    const results = await db.insert(validators).values(validator);

    revalidatePath("/dashboard");
    return results;
  } catch (error) {
    if (error instanceof Error) return error.stack;
  }
};
